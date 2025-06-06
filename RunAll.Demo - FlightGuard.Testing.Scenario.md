# FlightGuard Testing Scenarios

## Manual Testing in Remix IDE

### Setup Phase
1. Deploy contracts in this order:
   - FlightGuardToken
   - FlightGuardRegistry  
   - LiquidityPool (pass token address to constructor)
   - FlightGuardPolicy

### Test Scenario 1: Basic Policy Purchase Flow

**Step 1: Purchase a Basic Policy**
```
Function: purchasePolicy
Parameters:
- _flightNumber: "AA101"
- _departureTime: 1735689600 (January 1, 2025 timestamp)
- _tierLevel: 1 (Basic)
Value: 0.01 ETH
```

**Expected Result:**
- Policy created with ID 0
- Event: PolicyPurchased emitted
- Policy details stored correctly

**Verification:**
```
Function: policies
Parameter: 0
Check returned values match input
```

### Test Scenario 2: Oracle Simulation (Delay Processing)

**Step 1: Request Flight Status Check**
```
Function: checkFlightStatus
Parameter: 0 (policy ID)
```

**Expected Result:**
- Returns a request ID (bytes32)
- Event: OracleRequestSent emitted

**Step 2: Simulate Oracle Response (as owner)**
```
Function: fulfillFlightStatus
Parameters:
- _requestId: [use returned request ID from step 1]
- _delayMinutes: 150 (2.5 hours delay)
```

**Expected Result:**
- Event: FlightDelayDataReceived emitted
- Event: ClaimProcessed emitted (since 2.5 hrs > 1 hr threshold)
- Policy marked as claimed
- Payout sent to policyholder

### Test Scenario 3: Token Governance Flow

**Step 1: Check Initial Token Balance**
```
Function: balanceOf
Parameter: [your address]
Expected: 1000000000000000000000000 (1M tokens)
```

**Step 2: Create Governance Proposal**
```
Function: createProposal
Parameter: "Reduce minimum delay threshold to 30 minutes"
```

**Expected Result:**
- Proposal created with ID 0
- Event: ProposalCreated emitted

**Step 3: Vote on Proposal**
```
Function: vote
Parameters:
- _proposalId: 0
- _support: true
```

**Expected Result:**
- Event: Voted emitted
- Proposal vote count updated

### Test Scenario 4: Liquidity Pool Operations

**Step 1: Approve Tokens for Staking**
```
Contract: FlightGuardToken
Function: approve
Parameters:
- _spender: [LiquidityPool contract address]
- _value: 1000000000000000000000 (1000 tokens)
```

**Step 2: Stake Tokens**
```
Contract: LiquidityPool
Function: stake
Parameter: 1000000000000000000000 (1000 tokens)
```

**Expected Result:**
- Event: Staked emitted
- userStake updated
- totalStaked increased

**Step 3: Check Staking Info**
```
Function: getStakingInfo
Parameter: [your address]
```

**Expected Result:**
- Returns stakeAmount: 1000000000000000000000
- Returns share: 10000 (100% since you're the only staker)

### Test Scenario 5: Multi-Tier Policy Testing

**Test Different Tier Levels:**

**Premium Policy (Tier 2):**
```
Function: purchasePolicy
Parameters:
- _flightNumber: "DL205"
- _departureTime: 1735776000
- _tierLevel: 2
Value: 0.02 ETH
```

**Enterprise Policy (Tier 3):**
```
Function: purchasePolicy
Parameters:
- _flightNumber: "UA350"
- _departureTime: 1735862400
- _tierLevel: 3
Value: 0.03 ETH
```

**Test Different Delay Scenarios:**
- 30 minutes delay (no payout for any tier)
- 90 minutes delay (payout for tier 1 only)
- 150 minutes delay (payout for tier 1 & 2)
- 200 minutes delay (payout for all tiers)

### Test Scenario 6: Edge Cases

**Test 1: Invalid Policy Purchase**
```
Function: purchasePolicy
Parameters: (any valid flight data)
Value: 0 ETH
```
**Expected Result:** Transaction should revert with "Premium must be greater than 0"

**Test 2: Premature Flight Check**
```
Function: checkFlightStatus
Parameter: [policy ID with future departure time]
```
**Expected Result:** Transaction should revert with "Flight has not departed yet"

**Test 3: Double Claim Prevention**
```
After a policy has been claimed, try:
Function: checkFlightStatus
Parameter: [already claimed policy ID]
```
**Expected Result:** Transaction should revert with "Policy already claimed"

### Verification Checklist

For each test scenario, verify:
- [ ] Correct events are emitted
- [ ] State variables are updated properly
- [ ] Access controls work (only owner can call owner functions)
- [ ] Money flows correctly (ETH transfers work)
- [ ] Business logic is enforced (thresholds, tiers, etc.)

### Documentation of Test Results

Create a test log documenting:
1. Test scenario executed
2. Input parameters used
3. Expected vs actual results
4. Transaction hashes
5. Gas costs
6. Any errors encountered

This manual testing approach demonstrates:
- Core functionality works
- Business logic is correctly implemented
- Oracle integration works (simulated)
- Token economics function properly
- Security measures are in place