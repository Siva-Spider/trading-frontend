import { useState } from 'react';

const SelectStock = ({ stockCount, tradingParameters, selectedBrokers, onStockCountChange, onStockSymbolChange, onParameterChange, tradingStatus, onTradeToggle, onStartAllTrades, onClosePosition,onCloseAllPositions  }) => {

    const stock_map = {
        "RELIANCE INDUSTRIES LTD": "RELIANCE",
        "HDFC BANK LTD": "HDFCBANK",
        "ICICI BANK LTD.": "ICICIBANK",
        "INFOSYS LIMITED": "INFY",
        "TATA CONSULTANCY SERV LT": "TCS",
        "STATE BANK OF INDIA": "SBIN",
        "AXIS BANK LTD": "AXISBANK",
        "KOTAK MAHINDRA BANK LTD": "KOTAKBANK",
        "ITC LTD": "ITC",
        "LARSEN & TOUBRO LTD.": "LT",
        "BAJAJ FINANCE LIMITED": "BAJFINANCE",
        "HINDUSTAN UNILEVER LTD": "HINDUNILVR",
        "SUN PHARMACEUTICAL IND L": "SUNPHARMA",
        "MARUTI SUZUKI INDIA LTD": "MARUTI",
        "NTPC LTD": "NTPC",
        "HCL TECHNOLOGIES LTD": "HCLTECH",
        "ULTRATECH CEMENT LIMITED": "ULTRACEMCO",
        "TATA MOTORS LIMITED": "TATAMOTORS",
        "TITAN COMPANY LIMITED": "TITAN",
        "BHARAT ELECTRONICS LTD": "BEL",
        "POWER GRID CORP. LTD": "POWERGRID",
        "TATA STEEL LIMITED": "TATASTEEL",
        "TRENT LTD": "TRENT",
        "ASIAN PAINTS LIMITED": "ASIANPAINT",
        "JIO FIN SERVICES LTD": "JIOFIN",
        "BAJAJ FINSERV LTD": "BAJAJFINSV",
        "GRASIM INDUSTRIES LTD": "GRASIM",
        "ADANI PORT & SEZ LTD": "ADANIPORTS",
        "JSW STEEL LIMITED": "JSWSTEEL",
        "HINDALCO INDUSTRIES LTD": "HINDALCO",
        "OIL AND NATURAL GAS CORP": "ONGC",
        "TECH MAHINDRA LIMITED": "TECHM",
        "BAJAJ AUTO LIMITED": "BAJAJ-AUTO",
        "SHRIRAM FINANCE LIMITED": "SHRIRAMFIN",
        "CIPLA LTD": "CIPLA",
        "COAL INDIA LTD": "COALINDIA",
        "SBI LIFE INSURANCE CO LTD": "SBILIFE",
        "HDFC LIFE INS CO LTD": "HDFCLIFE",
        "NESTLE INDIA LIMITED": "NESTLEIND",
        "DR. REDDY S LABORATORIES": "DRREDDY",
        "APOLLO HOSPITALS ENTER. L": "APOLLOHOSP",
        "EICHER MOTORS LTD": "EICHERMOT",
        "WIPRO LTD": "WIPRO",
        "TATA CONSUMER PRODUCT LTD": "TATACONSUM",
        "ADANI ENTERPRISES LIMITED": "ADANIENT",
        "HERO MOTOCORP LIMITED": "HEROMOTOCO",
        "INDUSIND BANK LIMITED": "INDUSINDBK",
        "Nifty 50": "NIFTY","Nifty Bank": "BANKNIFTY", "Nifty Fin Service": "FINNIFTY", "NIFTY MID SELECT": "MIDCPNIFTY",
    };
    
    const broker_map = {
        "u": "Upstox",
        "z": "Zerodha",
        "a": "AngelOne",
        "g": "Groww",
        "5": "5paisa"
    };

    // ✅ Filter the connected brokers
    const connectedBrokers = selectedBrokers.filter(broker => 
        broker.profileData && broker.profileData.status === 'success'
    );
    return (
        <div style={{ padding: '20px' }}>
            <h2>Select Stocks</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div style={{ marginBottom: '15px' }}>
                    <label>
                        Number of Stocks (1-10):
                        <input 
                            type="number" 
                            min="1" 
                            max="10" 
                            value={stockCount} 
                            onChange={onStockCountChange}
                            style={{ marginLeft: '10px' }}
                        />
                    </label>
                </div>

                {/* Global Start Trade Button */}
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button 
                        type="button"
                        onClick={onStartAllTrades}
                        style={{ 
                            backgroundColor: '#28a745', 
                            color: 'white', 
                            border: 'none', 
                            padding: '10px 16px',
                            cursor: 'pointer'
                        }}
                    >
                        Start All Trades
                    </button>
                
                    <button 
                        type="button"
                        onClick={onCloseAllPositions}
                        style={{ 
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '10px 16px',
                            cursor: 'pointer'
                        }}
                    >
                        Close All Positions
                    </button>
                </div>

                {Array.from({ length: stockCount }).map((_, index) => {
                    const key = `stock_${index}`;
                    const currentParams = tradingParameters[key] || {};
                    const isTrading = tradingStatus[key] === 'active';
                    return (
                        <div key={key} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', flexWrap: 'nowrap', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                            {/* Stock Dropdown */}
                            <div style={{ marginRight: '10px' }}>
                                <label>
                                    Stock {index + 1}:
                                    <select 
                                        value={Object.keys(stock_map).find(key => stock_map[key] === currentParams.symbol) || 'RELIANCE INDUSTRIES LTD'}
                                        onChange={(e) => onStockSymbolChange(e, index)}
                                        style={{ marginLeft: '10px', width: '150px' }}
                                    >
                                        {Object.entries(stock_map).map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {key}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            
                            {/* Assign Broker Dropdown */}
                            <div style={{ marginRight: '10px' }}>
                                <label>
                                    Broker:
                                    <select
                                        value={currentParams.broker || ''}
                                        onChange={(e) => onParameterChange(e, index, 'broker')}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        <option value="">Select a broker</option>
                                        {connectedBrokers.map((broker, idx) => (
                                            <option key={idx} value={broker.name}>
                                                {broker_map[broker.name]}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                {/* Display a warning if no brokers are connected */}
                                {connectedBrokers.length === 0 && (
                                    <p style={{ color: 'red', margin: '5px 0 0 0', fontSize: '12px' }}>
                                        No brokers connected. Connect on the 'Connect Broker' tab.
                                    </p>
                                )}
                            </div>

                            {/* Strategy Dropdown */}
                            <div style={{ marginRight: '10px' }}>
                            <label>
                                Strategy:
                                <select
                                value={currentParams.strategy || 'ADX_MACD_WillR_Supertrend'}
                                onChange={(e) => onParameterChange(e, index, 'strategy')}
                                style={{ marginLeft: '10px' }}
                                >
                                <option value="ADX_MACD_WillR_Supertrend">ADX_MACD_WillR_Supertrend</option>
                                <option value="Ema10_Ema20_Supertrend">Ema10_Ema20_Supertrend</option>
                                </select>
                            </label>
                            </div>

                            {/* Interval Input */}
                            <div style={{ marginRight: '10px' }}>
                                <label>
                                    Interval:
                                    <select 
                                        value={currentParams.interval || 0}
                                        onChange={(e) => onParameterChange(e, index, 'interval')}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="5">5</option>
                                        <option value="15">15</option>
                                        <option value="30">30</option>
                                        <option value="60">60</option>
                                    </select>
                                </label>
                            </div>

                            {/* Number of Lots Input */}
                            <div style={{ marginRight: '10px' }}>
                                <label>
                                    Lots:
                                    <input 
                                        type="number" 
                                        min="0" 
                                        value={currentParams.lots || 0}
                                        onChange={(e) => onParameterChange(e, index, 'lots')} 
                                        style={{ marginLeft: '10px', width: '60px' }}
                                    />
                                </label>
                            </div>
                            
                            {/* Lot Size Input (Read-only) */}
                            <div style={{ marginRight: '10px' }}>
                                <label>
                                    Lot Size:
                                    <input 
                                        type="number" 
                                        min="0" 
                                        value={currentParams.lot_size || 0}
                                        readOnly
                                        style={{ marginLeft: '10px', width: '60px', backgroundColor: '#f0f0f0' }}
                                    />
                                </label>
                            </div>

                            {/* Total Shares Display */}
                            <div style={{ marginRight: '10px' }}>
                                <p style={{ margin: 0, whiteSpace: 'nowrap' }}>Total Shares: {currentParams.total_shares || 0}</p>
                            </div>
                            
                            {/* Target Percentage */}
                            <div style={{ marginRight: '10px' }}>
                                <label>
                                    Target %:
                                    <input 
                                        type="number" 
                                        min="0"
                                        value={currentParams.target_percentage || 0}
                                        onChange={(e) => onParameterChange(e, index, 'target_percentage')}
                                        style={{ marginLeft: '10px', width: '60px' }}
                                    />
                                </label>
                            </div>

                            {/* Individual Disconnect Button */}
                            {isTrading && (
                                <button 
                                    type="button" 
                                    onClick={() => onTradeToggle(index)}
                                    style={{ 
                                        marginTop: '0px', 
                                        backgroundColor: '#dc3545', 
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 12px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Disconnect
                                </button>
                            )}
                            {/* Individual Close Position Button */}
                            {isTrading && (
                                <button 
                                    type="button"
                                    onClick={() => onClosePosition(index)}
                                    style={{
                                        marginLeft: '10px',
                                        backgroundColor: '#007bff',   // Blue
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 12px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Close Position
                                </button>
                            )}

                        </div>
                    );
                })}
            </form>
            <p style={{ marginTop: '15px' }}>{Object.values(tradingStatus).some(status => status === 'active') ? 'At least one trade is active.' : 'No trades are active.'}</p>
        </div>
    );
};

export default SelectStock;
