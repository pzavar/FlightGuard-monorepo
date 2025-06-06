import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract, formatEther } from 'ethers';
import { FlightGuardPolicyAddress, FlightGuardPolicyABI } from '../contracts/config';

// Helper functions remain the same
const getTierName = (tierLevel) => {
    if (tierLevel === undefined || tierLevel === null) return "N/A";
    const tierNumber = Number(tierLevel);
    if (tierNumber === 1) return "Basic";
    if (tierNumber === 2) return "Premium";
    if (tierNumber === 3) return "Enterprise";
    return "Unknown";
};

const formatPolicyTimestamp = (timestamp) => {
    if (!timestamp || timestamp === "0") return 'N/A';
    try {
        return new Date(Number(timestamp) * 1000).toLocaleString();
    } catch (e) {
        return "Invalid Date";
    }
};

const getPolicyStatus = (policy) => {
    if (!policy) return "Unknown";
    if (policy[6] === true) return "Paid Out";
    if (policy[7] === true) return "Active";
    return "Expired";
};

export const MyPoliciesPage = ({ walletAddress }) => {
    const [policies, setPolicies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchPolicies = async () => {
        if (!walletAddress || typeof window.ethereum === 'undefined') {
            setError("Wallet not connected or not available.");
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const provider = new BrowserProvider(window.ethereum);
            const policyContract = new Contract(FlightGuardPolicyAddress, FlightGuardPolicyABI, provider);

            // --- THIS IS THE CORRECTED LOGIC ---

            // 1. Get the array of policy IDs for the user
            const policyIds = await policyContract.getPoliciesByHolder(walletAddress);
            console.log("Fetched Policy IDs:", policyIds);

            // 2. For each ID, fetch the full policy details from the public `policies` mapping
            const fetchedPolicies = await Promise.all(
                policyIds.map(id => policyContract.policies(id))
            );

            console.log("Fetched Full Policies:", fetchedPolicies);
            setPolicies(fetchedPolicies);

        } catch (err) {
            console.error("Error fetching policies:", err);
            setError("Failed to fetch policies. Check console and contract deployment.");
            setPolicies([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (walletAddress) {
            fetchPolicies();
        }
    }, [walletAddress]);

    return (
        <div className="my-policies-container">
            <h2>My Insurance Policies</h2>
            
            {isLoading ? (
                <p className="status-message">Loading policies...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : policies.length > 0 ? (
                <div className="policies-list">
                    {policies.map((policy, index) => (
                        <div key={index} className="policy-card">
                            <h3>Flight: {policy[1] || 'N/A'}</h3>
                            <p><strong>Status:</strong> <span className={`status-${getPolicyStatus(policy).toLowerCase().replace(/\s+/g, '-')}`}>{getPolicyStatus(policy)}</span></p>
                            <p><strong>Departure:</strong> {policy[2] ? formatPolicyTimestamp(policy[2].toString()) : 'N/A'}</p>
                            <p><strong>Tier:</strong> {getTierName(policy[8])}</p>
                            <p><strong>Premium Paid:</strong> {policy[3] ? formatEther(policy[3]) : '0'} ETH</p>
                            <p><strong>Potential Payout:</strong> {policy[4] ? formatEther(policy[4]) : '0'} ETH</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You have not purchased any policies yet.</p>
            )}

            <button className="button" onClick={fetchPolicies} disabled={isLoading} style={{marginTop: '1.5rem'}}>
                {isLoading ? 'Refreshing...' : 'Refresh Policies'}
            </button>
        </div>
    );
};