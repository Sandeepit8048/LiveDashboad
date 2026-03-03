import React, { useState } from 'react'

function Stats() {
    const [status, setStatus] = useState([
        { label: "Critical", count: 5, change: "+2%" },
        { label: "High", count: 12, change: "-1%" },
        { label: "Medium", count: 20, change: "+5%" },
        { label: "Low", count: 35, change: "+8%" }
    ])

    return (
        <div className="flex justify-between gap-4 p-4">
            {status.map((item, id) => (
                <div 
                    key={id} 
                    className="bg-white p-6 rounded-xl shadow-sm flex-1"
                >
                    <div className="text-gray-500">{item.label}</div>
                    <div className="text-2xl font-bold">{item.count}</div>
                    <div className="text-sm text-teal-600">{item.change}</div>
                </div>
            ))}
        </div>
    )
}

export default Stats