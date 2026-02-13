import django.contrib.auth.admin
from rest_framework.permissions import IsAuthenticated
from .serializer import BudgetSerailizer,ExpenseSerializer
from rest_framework import serializers
from datetime import date,datetime
from .models import Budget,Expense
import random
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
    serializer_class=ExpenseSerializer
    
    def perform_create(self, serializer):
        budget=serializer.validated_data['budget']
        if not budget.active_budget:
            raise serializers.ValidationError({
                "budget":"You can't add expense as the budget amount is exceeded."})
        serializer.save(user=self.request.user)
    def get_queryset(self):
        expenses=Expense.objects.filter(user=self.request.user)
        return expenses

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
