def get_reference_id(anomaly_type, data):
    if anomaly_type == "spike":
        reference_id = f"{data['type']}-{data['index']}-{data['expense_name']}-{data['expense_amount']}-{data['expense_category']}"
        return reference_id
    elif anomaly_type == "duplicate":
        reference_id = f"{data['type']}-{data['index']}-{data['expense_name']}-{data['expense_amount']}-{data['time_diff']}"
        return reference_id
    elif anomaly_type == "temporal":
        reference_id = f"{data['type']}-{data['index']}-{data['expense_name']}-{data['expense_amount']}"
        return reference_id
    else:
        reference_id = f"{data['type']}-{data['index']}-{data['expense_name']}-{data['expense_amount']}"
        return reference_id
