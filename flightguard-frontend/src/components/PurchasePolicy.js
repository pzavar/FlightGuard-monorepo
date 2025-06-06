import { useState } from 'react';
import { BrowserProvider, Contract, parseEther } from 'ethers';
import { FlightGuardPolicyAddress, FlightGuardPolicyABI } from '../contracts/config';

// Make sure onPurchaseSuccess is passed as a prop
export const PurchasePolicy = ({ onPurchaseSuccess }) => { 
    const [flightNumber, setFlightNumber] = useState('');
    const [departureTimestamp, setDepartureTimestamp] = useState('');
    const [tier, setTier] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const handlePurchase = async () => {
        if (!flightNumber || !departureTimestamp) {
            alert('Please fill out all fields.');
            return;
        }

        if (typeof window.ethereum !== 'undefined') {
            setIsLoading(true);
            setStatusMessage('Waiting for MetaMask confirmation...');
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const policyContract = new Contract(FlightGuardPolicyAddress, FlightGuardPolicyABI, signer);

                const premium = parseEther("0.01");
                const departureTimeForTx = Math.floor(new Date(departureTimestamp + 'Z').getTime() / 1000);
                const tierForTx = Number(tier);

                const transaction = await policyContract.purchasePolicy(
                    flightNumber,
                    departureTimeForTx,
                    tierForTx,
                    { value: premium }
                );

                setStatusMessage('Transaction sent, waiting for confirmation...\nPlease do not refresh the page.');
                
                const receipt = await transaction.wait(); // Wait for the transaction to be mined

                setStatusMessage('');
                setIsLoading(false);
                // Call the callback with transaction hash and policy details
                if (onPurchaseSuccess) {
                    onPurchaseSuccess(receipt.hash, {
                        flightNumber,
                        departureTimestamp: departureTimestamp, // Store the original string for display
                        tier: tierForTx
                    });
                }

            } catch (error) {
                console.error("Error purchasing policy:", error);
                alert('Error purchasing policy. See console for details.');
                setIsLoading(false);
                setStatusMessage('');
            }
        } else {
            alert('Please install MetaMask!');
        }
    };

    return (
        <div className="form-container">
            <h2>Purchase Flight Insurance</h2>
            <div className="form-control">
                <label htmlFor="flight-number">Flight Number</label>
                <input
                    id="flight-number"
                    type="text"
                    placeholder="e.g., DL8627"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            <div className="form-control">
                <label htmlFor="departure-time">Departure Date and Time</label>
                <input
                    id="departure-time"
                    type="datetime-local"
                    value={departureTimestamp}
                    onChange={(e) => setDepartureTimestamp(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            <div className="form-control">
                <label htmlFor="tier-select">Insurance Tier</label>
                <select id="tier-select" value={tier} onChange={(e) => setTier(e.target.value)} disabled={isLoading}>
                    <option value={1}>Basic (1hr threshold)</option>
                    <option value={2}>Premium (2hr threshold)</option>
                    <option value={3}>Enterprise (3hr threshold)</option>
                </select>
            </div>

            <button className="button" onClick={handlePurchase} disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Purchase Policy (0.01 ETH)'}
            </button>
            
            {statusMessage && <p className="status-message">{statusMessage}</p>}
        </div>
    );
};