async function addPricePlan() {
    // Add new price plan
    const response = await fetch('/api/price_plan/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: this.newPlanName,
            call_cost: this.newCallCost,
            sms_cost: this.newSmsCost
        })
    });

    const data = await response.json();
    console.log(data);

    // Fetch updated plans to ensure the new plan is included
    const updatedResponse = await fetch('/api/price_plans');
    const updatedData = await updatedResponse.json();
    this.plans = updatedData;

    // Clear input fields
    this.newPlanName = '';
    this.newCallCost = 0;
    this.newSmsCost = 0;
}