
## Test Scenario 1: Basic Policy Purchase Flow

This test demonstrates the core functionality of buying flight insurance. Here's what each part means:

### Step 1: Purchase a Basic Policy

**What we're doing:** Simulating a customer buying insurance for their flight.

**In Remix IDE, here's exactly how to do this:**

1. **Navigate to the deployed FlightGuardPolicy contract**
   - Go to "Deploy & Run Transactions" tab
   - Find your deployed FlightGuardPolicy contract
   - Expand it to see all functions

2. **Locate the `purchasePolicy` function**
   - You'll see it has a red button (because it's payable)
   - It has input fields for the parameters

3. **Fill in the parameters:**
   ```
   _flightNumber: "AA101"
   _departureTime: 1735689600
   _tierLevel: 1
   ```

   **What these mean:**
   - `"AA101"`: American Airlines flight 101 (just an example flight)
   - `1735689600`: This is a Unix timestamp for January 1, 2025, 12:00 AM UTC
     - You can use [this converter](https://www.epochconverter.com/) to get current future timestamps
     - **Important**: Must be a future date, or the contract will reject it
   - `1`: Basic tier insurance (1-hour delay threshold)

4. **Set the Value (Premium):**
   - In the "Value" field above the function buttons, enter: `10000000000000000`
   - Or set the unit to "ether" and enter: `0.01`
   - This is the insurance premium the customer pays

5. **Execute the transaction:**
   - Click the red "purchasePolicy" button
   - Confirm the transaction in MetaMask (if using)

### Expected Results Explained

**"Policy created with ID 0":**
- The first policy gets ID 0, second gets ID 1, etc.
- This ID is used to reference the policy later

**"Event: PolicyPurchased emitted":**
- In Remix, after the transaction, check the console/logs
- You should see something like:
  ```
  {
    "event": "PolicyPurchased",
    "args": {
      "policyId": 0,
      "policyholder": "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
      "flightNumber": "AA101",
      "premium": "10000000000000000"
    }
  }
  ```

**"Policy details stored correctly":**
- The contract saves all the policy information in its storage

### Verification Step

**How to verify it worked:**

1. **Find the `policies` function** (it's a blue button - read-only)
2. **Enter parameter: `0`** (the policy ID)
3. **Click the button**

**You should see output like:**
```
0: address: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4  // policyholder
1: string: AA101                                          // flightNumber  
2: uint256: 1735689600                                    // departureTime
3: uint256: 10000000000000000                            // premium (0.01 ETH)
4: uint256: 20000000000000000                            // payoutAmount (0.02 ETH - 2x premium)
5: uint8: 1                                              // delayThreshold (1 hour)
6: bool: false                                           // claimed (not claimed yet)
7: bool: true                                            // active (policy is active)
8: uint8: 1                                              // tierLevel (Basic)
```

### What This Proves

This test demonstrates:
- ✅ The contract accepts policy purchases
- ✅ It correctly calculates payout amounts (2x premium for Basic tier)
- ✅ It stores all policy data properly
- ✅ It assigns unique policy IDs
- ✅ It emits events for tracking
- ✅ It validates input parameters (future departure time, valid tier, non-zero premium)

### Common Issues You Might Encounter

1. **"Departure time must be in the future"**
   - Use a timestamp that's later than current time
   - Try: 1704067200 (January 1, 2024) or any future date

2. **"Premium must be greater than 0"**
   - Make sure you set a value > 0 in the Value field

3. **"Invalid tier level"**
   - Use 1, 2, or 3 only

