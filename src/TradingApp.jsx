import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import ConnectBroker from './components/ConnectBroker';
import SelectStock from './components/SelectStock';
import TradeResults from './components/TradeResults';
import './App.css';

function App() {
    // ✅ Persist activeTab
    const [activeTab, setActiveTab] = useState(() => localStorage.getItem("activeTab") || 'connect');

    // ✅ ConnectBroker state
    const [brokerCount, setBrokerCount] = useState(() => parseInt(localStorage.getItem("brokerCount")) || 1);
    const [selectedBrokers, setSelectedBrokers] = useState(() => {
        const saved = localStorage.getItem("selectedBrokers");
        return saved ? JSON.parse(saved) : [{ name: 'u', credentials: {}, profileData: null }];
    });

    // ✅ SelectStock state
    const [stockCount, setStockCount] = useState(() => parseInt(localStorage.getItem("stockCount")) || 1);
    const [tradingParameters, setTradingParameters] = useState(() => {
        const saved = localStorage.getItem("tradingParameters");
        return saved ? JSON.parse(saved) : {};
    });
    const [tradingStatus, setTradingStatus] = useState(() => {
        const saved = localStorage.getItem("tradingStatus");
        return saved ? JSON.parse(saved) : {};
    });
    const [tradeLogs, setTradeLogs] = useState(() => {
        const saved = localStorage.getItem("tradeLogs");
        return saved ? JSON.parse(saved) : [];
    });
    const [user, setUser] = useState(() => { const saved = localStorage.getItem("loggedInUser"); return saved ? JSON.parse(saved) : null; });

    const API_URL = "https://trading-backend-1-l859.onrender.com";

    // ✅ Persist state to localStorage whenever it changes
    useEffect(() => { localStorage.setItem("activeTab", activeTab); }, [activeTab]);
    useEffect(() => { localStorage.setItem("brokerCount", brokerCount); }, [brokerCount]);
    useEffect(() => { localStorage.setItem("selectedBrokers", JSON.stringify(selectedBrokers)); }, [selectedBrokers]);
    useEffect(() => { localStorage.setItem("stockCount", stockCount); }, [stockCount]);
    useEffect(() => { localStorage.setItem("tradingParameters", JSON.stringify(tradingParameters)); }, [tradingParameters]);
    useEffect(() => { localStorage.setItem("tradingStatus", JSON.stringify(tradingStatus)); }, [tradingStatus]);
    useEffect(() => { localStorage.setItem("tradeLogs", JSON.stringify(tradeLogs)); }, [tradeLogs]);

    // Real-time log streaming
    useEffect(() => {
        let eventSource;
        try {
            eventSource = new EventSource(`${API_URL}/api/stream-logs`);

            eventSource.onmessage = (event) => {
                if (event.data) setTradeLogs(prev => [...prev, event.data]);
            };

            eventSource.onerror = (err) => {
                console.error("EventSource failed:", err);
                if (eventSource) eventSource.close();
            };
        } catch (err) {
            console.error("EventSource init failed:", err);
        }

        return () => { if (eventSource) eventSource.close(); };
    }, []);

    // Broker handlers
    const handleBrokerCountChange = (e) => {
        const newCount = parseInt(e.target.value, 10);
        if (newCount >= 1 && newCount <= 5) {
            setBrokerCount(newCount);
            setSelectedBrokers(prev => {
                const newBrokers = prev.slice(0, newCount);
                while (newBrokers.length < newCount) {
                    newBrokers.push({ name: 'u', credentials: {}, profileData: null });
                }
                return newBrokers;
            });
        }
    };

    const handleBrokerChange = (e, index) => {
        const newSelectedBrokers = [...selectedBrokers];
        newSelectedBrokers[index] = { ...newSelectedBrokers[index], name: e.target.value, profileData: null };
        setSelectedBrokers(newSelectedBrokers);
    };

    const handleCredentialChange = (e, index, credentialName) => {
        const newSelectedBrokers = [...selectedBrokers];
        newSelectedBrokers[index].credentials[credentialName] = e.target.value;
        setSelectedBrokers(newSelectedBrokers);
    };

    const handleConnectBroker = async (e) => {
        e.preventDefault();
        setTradeLogs([]);

        try {
            const response = await fetch(`${API_URL}/api/connect-broker`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brokers: selectedBrokers })
            });
            const data = await response.json();

            setSelectedBrokers(prev => prev.map(broker => {
                const fetchedData = data.find(item => item.broker_key === broker.name);
                if (fetchedData && fetchedData.status === 'success') {
                    return { ...broker, profileData: fetchedData.profileData };
                }
                return { ...broker, profileData: { status: 'failed', message: fetchedData?.message || 'Connection failed.' } };
            }));

        } catch (err) {
            console.error('Error connecting to broker:', err);
            setTradeLogs(prev => [...prev, '❌ An error occurred while connecting to the broker.']);
        }
    };

    // Stock handlers
    const handleStockCountChange = (e) => {
        const newCount = parseInt(e.target.value, 10);
        if (newCount >= 1 && newCount <= 10) {
            setStockCount(newCount);
            const newParams = {};
            const newStatus = {};
            for (let i = 0; i < newCount; i++) {
                const key = `stock_${i}`;
                newParams[key] = tradingParameters[key] || {
                    symbol_value: 'RELIANCE',
                    symbol_key: '',
                    broker: '',
                    strategy: 'ADX_MACD_WillR_Supertrend',
                    interval: 0,
                    lots: 0,
                    lot_size: 0,
                    total_shares: 0,
                    target_percentage: 0,
                    type: 'EQUITY'
                };
                newStatus[key] = tradingStatus[key] || 'inactive';
            }
            setTradingParameters(newParams);
            setTradingStatus(newStatus);
        }
    };

    const handleParameterChange = (e, index, paramName) => {
        const key = `stock_${index}`;
        const newValue = e.target.value;

        setTradingParameters(prev => {
            const updated = {
                ...prev,
                [key]: { ...prev[key], [paramName]: newValue }
            };

            const lots = parseInt(updated[key].lots || 0, 10);
            const lotSize = parseInt(updated[key].lot_size || 0, 10);
            updated[key].total_shares = (lots > 0 && lotSize > 0) ? lots * lotSize : 0;
          

            return updated;
        });
    };

    const handleStockSelection = async (index, symbol_key, symbol_value, type) => {
        const key = `stock_${index}`;

        setTradingParameters(prev => ({
            ...prev,
            [key]: { ...prev[key], symbol_key, symbol_value, type }
        }));

        // Fetch lot size
        try {
            const response = await fetch(`${API_URL}/api/get-lot-size`,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symbol_key, symbol_value, type })
        });
            const data = await response.json();

            if (data.lot_size) {
                const fetchedLotSize = data.lot_size;
                const currentLots = tradingParameters[key]?.lots || 0;
                const newTotalShares = currentLots * fetchedLotSize;

                setTradingParameters(prev => ({
                    ...prev,
                    [key]: { ...prev[key], lot_size: fetchedLotSize, total_shares: newTotalShares }
                }));
            } else {
                console.error("Lot size not found for this stock/commodity.");
            }
        } catch (err) {
            console.error("Error fetching lot size:", err);
        }
    };

    // Trade handlers
    const handleTradeToggle = async (index) => {
        const key = `stock_${index}`;
        const currentStatus = tradingStatus[key];
        const symbol = tradingParameters[key].symbol_value;

        if (currentStatus === 'active') {
            try {
                const response = await fetch(`${API_URL}/api/disconnect-stock`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ symbol_value:symbol })
                });
                const result = await response.json();

                setTradingStatus(prev => ({ ...prev, [key]: 'inactive' }));
                setTradeLogs(prev => [...prev, `🛑 ${result.message}`]);
            } catch (err) {
                console.error("Disconnect failed:", err);
                setTradeLogs(prev => [...prev, `❌ Error disconnecting ${symbol_value}`]);
            }
            return;
        }

        if (!tradingParameters[key].broker) {
            setTradeLogs(prev => [...prev, `❌ Please select a broker for ${symbol_value}.`]);
            return;
        }

        setTradingStatus(prev => ({ ...prev, [key]: 'active' }));
        setTradeLogs(prev => [...prev, `🟢 Initiating trade for ${symbol_value}...`]);
        setActiveTab('results');
    };

    const handleStartAllTrades = async () => {
        setActiveTab('results');

        let allParams = [];
        for (let i = 0; i < stockCount; i++) {
            const key = `stock_${i}`;
            const params = tradingParameters[key];
            if (params?.broker) allParams.push(params);
            else setTradeLogs(prev => [...prev, `❌ Please select a broker for Stock ${i + 1}.`]);
        }

        if (!allParams.length) {
            setTradeLogs(prev => [...prev, "⚠️ No valid stock parameters to start trades."]);
            return;
        }

        try {
            setTradeLogs(prev => [...prev, "🟢 Starting all trades together..."]);

            const tradeResponse = await fetch(`${API_URL}/api/start-all-trading`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tradingParameters: allParams, selectedBrokers })
            });

            const tradeData = await tradeResponse.json();
            setTradeLogs(prev => [...prev, ...tradeData.logs]);

            let newStatus = {};
            allParams.forEach((_, i) => { newStatus[`stock_${i}`] = 'active'; });
            setTradingStatus(prev => ({ ...prev, ...newStatus }));
        } catch (err) {
            console.error('Error starting trades:', err);
            setTradeLogs(prev => [...prev, `❌ Error starting trades: ${err.message}`]);
        }
    };

    const handleClosePosition = async (index) => {
        const key = `stock_${index}`;
        const symbol = tradingParameters[key]?.symbol_value;

        try {
            const response = await fetch(`${API_URL}/api/close-position`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ symbol_value })
            });
            const result = await response.json();
            setTradeLogs(prev => [...prev, `🔵 ${result.message}`]);
        } catch (err) {
            console.error("Close position failed:", err);
            setTradeLogs(prev => [...prev, `❌ Error closing position for ${symbol_value}`]);
        }
    };
    const handleLogout = () => { 
        // Clear localStorage localStorage.clear(); 
        // Reset all state 
        localStorage.clear();
        setUser(null); 
        setActiveTab('connect'); 
        setBrokerCount(1); 
        setSelectedBrokers([{ name: 'u', credentials: {}, profileData: null }]); 
        setStockCount(1); 
        setTradingParameters({}); 
        setTradingStatus({}); 
        setTradeLogs([]); 
    };

    if (!user) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    const handleCloseAllPositions = async () => {
        try {
            const response = await fetch(`${API_URL}/api/close-all-positions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            const result = await response.json();
            setTradeLogs(prev => [...prev, `🔵 ${result.message}`]);
        } catch (err) {
            console.error("Close all positions failed:", err);
            setTradeLogs(prev => [...prev, "❌ Error closing all positions"]);
        }
    };

    const handleClearLogs = () => setTradeLogs([]);

    const renderContent = () => {
        switch (activeTab) {
            case 'connect':
                return (
                    <ConnectBroker 
                        brokerCount={brokerCount}
                        selectedBrokers={selectedBrokers}
                        onBrokerCountChange={handleBrokerCountChange}
                        onBrokerChange={handleBrokerChange}
                        onCredentialChange={handleCredentialChange}
                        onConnect={handleConnectBroker}
                    />
                );
            case 'select':
                return (
                    <SelectStock 
                        stockCount={stockCount}
                        tradingParameters={tradingParameters}
                        selectedBrokers={selectedBrokers}
                        tradingStatus={tradingStatus}
                        onStockCountChange={handleStockCountChange}
                        onStockSelection={handleStockSelection}
                        onParameterChange={handleParameterChange}
                        onTradeToggle={handleTradeToggle}
                        onStartAllTrades={handleStartAllTrades}
                        onClosePosition={handleClosePosition}
                        onCloseAllPositions={handleCloseAllPositions}
                    />
                );
            case 'results':
                return <TradeResults tradeLogs={tradeLogs} onClearLogs={handleClearLogs} />;
            default:
                return <div>Please select a tab.</div>;
        }
    };

    return (
        <div className="app-container">
            
            <header className="app-header">
                <img src="/astya_vyuha_logo.png" alt="Logo" className="app-logo" />
                <h1>ASTA VYUHA</h1>
                {/* Logout button */} 
                {user && ( 
                    <button 
                    onClick={handleLogout} 
                    style={{ 
                        marginTop: '10px', 
                        padding: '5px 15px', 
                        backgroundColor: '#f44336', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer' 
                        }} 
                    > 
                    Logout 
                    </button> )}
            </header>
            <div className="main-content">
                <div className="tab-buttons">
                    <button onClick={() => setActiveTab('connect')} className={activeTab === 'connect' ? 'active' : ''}>Connect Broker</button>
                    <button onClick={() => setActiveTab('select')} className={activeTab === 'select' ? 'active' : ''}>Select Stock</button>
                    <button onClick={() => setActiveTab('results')} className={activeTab === 'results' ? 'active' : ''}>Trade Results</button>
                </div>
                <div className="tab-content">{renderContent()}</div>
            </div>
        </div>
    );
}


export default App;
