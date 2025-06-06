import { useState } from 'react';
import { PurchasePolicy } from './components/PurchasePolicy';
import { ConfirmationPage } from './components/ConfirmationPage'; // New import
import { MyPoliciesPage } from './components/MyPoliciesPage';   // New import
import './App.css';

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [currentView, setCurrentView] = useState("purchase"); // "purchase", "confirmation", "myPolicies"
  const [lastTransactionHash, setLastTransactionHash] = useState("");
  const [lastPolicyDetails, setLastPolicyDetails] = useState(null); // To pass to confirmation

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setCurrentView("purchase"); // Default to purchase view after connecting
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const handlePurchaseSuccess = (txHash, policyDetails) => {
    setLastTransactionHash(txHash);
    setLastPolicyDetails(policyDetails);
    setCurrentView("confirmation");
  };

  const navigateTo = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 onClick={() => navigateTo("purchase")} style={{cursor: 'pointer'}}>FlightGuard</h1>
        <nav className="navigation">
          {walletAddress && (
            <>
              <button className="nav-button" onClick={() => navigateTo("purchase")}>Purchase Policy</button>
              <button className="nav-button" onClick={() => navigateTo("myPolicies")}>My Policies</button>
            </>
          )}
        </nav>
        {walletAddress ? (
          <div className="wallet-info">
            <div className="label">Connected</div>
            <div className="address">
              {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
            </div>
          </div>
        ) : (
          <button className="button" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </header>

      <main className="content-box">
        {!walletAddress && (
          <div>
            <h2>Secure your trip with decentralized insurance.</h2>
            <p>Get automated, instant payouts for flight delays directly to your wallet. Connect to begin.</p>
          </div>
        )}

        {walletAddress && currentView === "purchase" && (
          <PurchasePolicy onPurchaseSuccess={handlePurchaseSuccess} />
        )}
        {walletAddress && currentView === "confirmation" && (
          <ConfirmationPage
            transactionHash={lastTransactionHash}
            policyDetails={lastPolicyDetails}
            onNavigate={navigateTo}
          />
        )}
        {walletAddress && currentView === "myPolicies" && (
          <MyPoliciesPage walletAddress={walletAddress} />
        )}
      </main>
    </div>
  );
}

export default App;