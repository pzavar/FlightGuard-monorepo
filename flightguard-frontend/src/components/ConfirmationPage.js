import React from 'react';

// Helper to format tier
const getTierName = (tier) => {
    if (tier === 1) return "Basic";
    if (tier === 2) return "Premium";
    if (tier === 3) return "Enterprise";
    return "Unknown";
};

// Helper to format date
const formatDisplayDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleString();
    } catch (e) {
        return dateString; // fallback to original string if parsing fails
    }
};


export const ConfirmationPage = ({ transactionHash, policyDetails, onNavigate }) => {
    const etherscanLink = `https://sepolia.etherscan.io/tx/${transactionHash}`;

    return (
        <div className="confirmation-container">
            <h2>Policy Purchased Successfully!</h2>
            
            {policyDetails && (
                <div className="policy-summary-card">
                    <h3>Policy Details:</h3>
                    <p><strong>Flight Number:</strong> {policyDetails.flightNumber}</p>
                    <p><strong>Departure:</strong> {formatDisplayDate(policyDetails.departureTimestamp)}</p>
                    <p><strong>Tier:</strong> {getTierName(policyDetails.tier)}</p>
                </div>
            )}

            <div className="transaction-details">
                <p>Your transaction has been confirmed on the blockchain.</p>
                <p>
                    <strong>Transaction Hash:</strong> 
                    <a href={etherscanLink} target="_blank" rel="noopener noreferrer" className="etherscan-link">
                        {transactionHash}
                    </a>
                </p>
            </div>

            <div className="next-steps">
                <h3>Next Steps:</h3>
                <button className="button" onClick={() => onNavigate("myPolicies")}>
                    View in My Policies
                </button>
                <button className="button secondary" onClick={() => onNavigate("purchase")}>
                    Purchase Another Policy
                </button>
            </div>
        </div>
    );
};