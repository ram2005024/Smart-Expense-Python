from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from expense.pagination import ExpensePagination
from expense.filter import ExpenseFilter
from rest_framework.decorators import action
from .serializer import BudgetSerailizer,ExpenseSerializer
from rest_framework import serializers
from datetime import datetime
from .models import Budget,Expense
import random
from django.db.models import Sum,F
import requests
from rest_framework.decorators import api_view,permission_classes
from rest_framework import viewsets
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from . import models
fast_api_url="http://127.0.0.1:8001/ai/"
# Create your views here.
class BudgetView(viewsets.ModelViewSet):
    queryset=models.Budget.objects.all()
    permission_classes=[IsAuthenticated]
    serializer_class=BudgetSerailizer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    def get_queryset(self):
        budgets=Budget.objects.filter(user=self.request.user)
        return budgets
class ExpenseView(viewsets.ModelViewSet):
    queryset=models.Expense.objects.all()
    permission_classes=[IsAuthenticated]
    filter_backends=[DjangoFilterBackend]
    filterset_class=ExpenseFilter
    serializer_class=ExpenseSerializer
    pagination_class=ExpensePagination
    
    
    
   
    
    def create(self, request, *args, **kwargs):
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Get the updated count of the new Expense list
        count=Expense.objects.count()
        return Response(
            {
                "data":serializer.data,
                "count":count
            },
            status=status.HTTP_201_CREATED
        )
        
    @action(detail=False,methods=['POST'])
    def bulk_delete(self,request):
        # Get all the ids from the frontend
        ids=request.POST.get("ids",[])
        if not ids:
            return Response({"error":"Failed to delete the expense"},status=status.HTTP_400_BAD_REQUEST)
        # Delete the expense whose ids matches
        delete_count,_=Expense.objects.filter(id__in=ids).delete()
        return Response({"message":"Deleted successfully","delete_count":delete_count},status=status.HTTP_200_OK)

    def get_queryset(self):
        expenses=Expense.objects.filter(user=self.request.user)
        # Return if the method is put 
        if self.request.method=='PUT':
            return expenses
        # Return all the expense that user reuqest for particular date
        date_str=self.request.query_params.get("date")
        # Convert the date into normal datetime object
        if date_str:
            try:
                parsed_date=datetime.strptime(date_str,"%b %Y")
                expenses=expenses.filter(
                    created_at__year=parsed_date.year,
                    created_at__month=parsed_date.month
                )
            except ValueError:
                raise serializers.ValidationError({
                    "date":"Please provide the date field in MMM YYYY format"
                })
        return expenses.order_by("-created_at")

class BudgetRetrieve(generics.RetrieveAPIView):
    serializer_class=BudgetSerailizer
    queryset=Budget
    permission_classes=[IsAuthenticated]
    
    def retrieve(self, request, *args, **kwargs):
        # Get the budget instance and then send to serializer for proper json
        instance=self.get_object()
        serializer=self.get_serializer(instance)
        expense_amount=0
        # Send the payload to the fastapi to get proper ai insights
        for expense in serializer.data['budget_expenses']:
            expense_amount+=expense['expense_amount']
       
        payload={
            "expense_amount":expense_amount,
            "budget_amount":serializer.data['budget_amount'],
            "budget_time":serializer.data['budget_limit'],
            "created_at":serializer.data['created_at']
        }
        response=requests.post(fast_api_url + "budget/budget_insights",json=payload)
        data=response.json()
        if data['status']=="full":
            instance.active_budget=False
            instance.save()
        print(instance.active_budget)
        return Response(data,status=status.HTTP_200_OK)

class RetrieveUserExpense(generics.ListAPIView):
    serializer_class=ExpenseSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        expenses=Expense.objects.filter(user=self.request.user)
        return expenses
    def list(self, request, *args, **kwargs):
        data=self.get_queryset()
        serializer=self.get_serializer(data,many=True)
        response=requests.post(fast_api_url + "expense/expense_insight",json=serializer.data)
        data=response.json()
        return Response(data,status=status.HTTP_200_OK)        
    
    # Get the expense trend
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_expense_trend(request):
    user=request.user
    # Dummy expense data from 17 days and provide to fast api to analyze the trend
    category=['FOOD','CLOTHS','STUDY','GROCERIES','GADGETS','OTHERS']
    start_date=datetime.date.today() -datetime.timedelta(days=13)
    expenses=[
        {
            "category":random.choice(category),
            "amount":random.randint(100,600),
            "created_at":str(start_date+datetime.timedelta(days=random.randint(1,14)))
        }
    for i in range(100)
    ] 
    try:
        response=requests.post(fast_api_url + "expense/trend_analyse",json={
            "expense":expenses,
            "start_date":start_date.isoformat()
        })
        if response.status_code==200:
            return Response(response.json(),status=status.HTTP_200_OK)
        else:
            return Response(
                {
                    "message":"Error something went wrong generating the trend.Try again later",
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    except requests.exceptions.ConnectionError:
        return Response (
            {
                "message":"Error connecting to the fastapi.Please try again"
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except requests.exceptions.Timeout:
        return Response (
            {
                "error":"Timeout .Please try again"
            },
            status=status.HTTP_408_REQUEST_TIMEOUT
        )
    except Exception as e:
        return Response (
            {
                "error":f"Error occured: {str(e)}"
            },
            status=status.HTTP_408_REQUEST_TIMEOUT
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_expense_anomaly(request):
    # GET ALL THE EXPENSES OF THE USER
    expenses=Expense.objects.filter(user=request.user)
    serializer=ExpenseSerializer(expenses,many=True)
    # Format the data for anomaly detection
    expense_data=[]
    for exp in serializer.data:
        expense_data.append(
            {
                "expense_amount":exp["expense_amount"],
                "category":exp['expense_category'],
                "created_at":datetime.fromisoformat(exp['created_at'].replace("Z","")).date().isoformat()
            }
        )
    try:
            res=requests.post(fast_api_url + "expense/anomaly_detection",json=expense_data)
            if res.status_code==200:
                return Response(res.json(),status=status.HTTP_200_OK)
            else:
                return Response(
                {
                    "message":"Error something went wrong the anomaly insight.Try again later",
                    },
                status=status.HTTP_400_BAD_REQUEST
            )
    except requests.exceptions.ConnectionError:
            return Response (
            {
                "message":"Error connecting to the fastapi.Please try again"
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except requests.exceptions.Timeout:
            return Response (
            {
                "error":"Timeout .Please try again"
            },
            status=status.HTTP_408_REQUEST_TIMEOUT
        )
    except Exception as e:
            return Response (
            {
                "error":f"Error occured: {str(e)}"
            },
            status=status.HTTP_408_REQUEST_TIMEOUT
        )    

class RetriveBudgetSpendPrediction(generics.RetrieveAPIView):
    serializer_class=BudgetSerailizer
    permission_classes=[IsAuthenticated]
    queryset=Budget.objects.all()
    
    def retrieve(self, request, *args, **kwargs):
         budgets=self.get_object()
         serializer=self.get_serializer(budgets)
         budget_data=serializer.data
         data=[
             {
               "budget_start_date":budget_data["created_at"], 
               "budget_amount":budget_data["budget_amount"], 
               "budget_time":budget_data["budget_limit"],
               "expense_amount":exp["expense_amount"], 
               "expense_start_date":exp["created_at"], 
             } for exp in serializer.data["budget_expenses"] 
         ]
         response=requests.post(fast_api_url + "budget/expense_prediction",json=data)
         response_data=response.json()
         return Response(response_data,status=status.HTTP_200_OK)
# View to get the total-spend insight
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_total_spend_insight(request):
    year=int(request.GET.get("year",datetime.now().year))
    month=int(request.GET.get("month",datetime.now().month))
    user_id=request.user.id
    # Requests the fastapi end point and get the result
    response=requests.get(fast_api_url+f"expense/analytics/total_spent",
                          params={
                              "month":month,
                              "year":year,
                              "user_id":user_id
                          }
                          )
    if response.status_code==200:
        return Response(response.json(),status=status.HTTP_200_OK)
    else:
        return Response({"message":"Error while getting the analyzed data"},status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analyse_reimbrushed(request):
    user_id=request.user.id
    year=int(request.GET.get("year",datetime.now().year))
    month=int(request.GET.get("month",datetime.now().month))
    # Call the fastapi end point for analytics
    response=requests.get(fast_api_url+"expense/reimbrush/analyse",
                          params={
                              "user_id":user_id,
                              "month":month,
                              "year":year,
                          })
    if response.status_code==200:
        return Response(response.json(),status=status.HTTP_200_OK)
    else:
        return Response({"message":"Something went wrong"},status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analyse_pending(request):
    user_id=request.user.id
    year=int(request.GET.get("year",datetime.now().year))
    month=int(request.GET.get("month",datetime.now().month))
    # Call the fastapi end point for analytics
    response=requests.get(fast_api_url+"expense/pending/analyse",
                          params={
                              "user_id":user_id,
                              "month":month,
                              "year":year,
                          })
    if response.status_code==200:
        return Response(response.json(),status=status.HTTP_200_OK)
    else:
        return Response({"message":"Something went wrong"},status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analyse_decline(request):
    user_id=request.user.id
    year=int(request.GET.get("year",datetime.now().year))
    month=int(request.GET.get("month",datetime.now().month))
    # Call the fastapi end point for analytics
    response=requests.get(fast_api_url+"expense/decline/analyse",
                          params={
                              "user_id":user_id,
                              "month":month,
                              "year":year,
                          })
    if response.status_code==200:
        return Response(response.json(),status=status.HTTP_200_OK)
    else:
        return Response({"message":"Something went wrong"},status=status.HTTP_400_BAD_REQUEST)

# Views to get the spend per categories
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_spend_by_categories(request):
    # Get the user id and fetch the expense by user id
    user_id=request.user.id
    date_str=request.GET.get("date")
    parsed_date=datetime.strptime(date_str,"%b %Y")
    
    expenses=Expense.objects.filter(user=user_id,created_at__year=parsed_date.year,created_at__month=parsed_date.month)
    # Now get the expense category and its total per category
    final_expense=expenses.values("expense_category").annotate(total=Sum("expense_amount")).order_by("-total")
    final_expense=[{**expense, "total": round(expense['total'],2)} for expense in final_expense]
    return Response({
        "summary":list(final_expense),
       
    }, status=status.HTTP_200_OK)
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_category_budget_usage(request):
    # Get the expense of user according to the category
    date_str=request.GET.get("date")
    parsed_str=datetime.strptime(date_str,"%b %Y")
    # Get the expense of the provided date
    budgets=Budget.objects.filter(
        budget_expenses__created_at__year=parsed_str.year,
        budget_expenses__created_at__month=parsed_str.month,
        is_active=True
    ).annotate(
        spent=Sum("budget_expenses__expense_amount"),
        percent=(Sum("budget_expenses__expense_amount")*100.0/F('budget_amount'))
    )
    summary=[]
    for b in budgets:
        summary.append({
            "budget_category":b.budget_field,
            "spent":round(b.spent) or 0,
            "total":round(b.budget_amount) or 0,
            "percent":round(b.percent,2) or 0
        })
    return Response(summary,status=status.HTTP_200_OK)