import React, { useState } from 'react'

function Slider() {
   
    const [slide, setSlide]= useState(["Dashboard"," Projects", "Scans", "Schedule", "Notifications", "Settings", "Support" ])

      

  return (
   <div className="flex h-screen bg-gray-100">
    <aside className="w-64 bg-white shadow-lg flex flex-col justify-between">
     <div className="p-6 text-xl font-bold border-b">Security App</div>
     <nav className="p-4 space-y-2">
        {
            slide.map((item, id)=>{
                return(
                    <div key={id}  className="px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                       <ul>
                        <li>{item}</li>
                         
                       </ul>
                    </div>
                )
            })
        }
        </nav>
          <div className="p-4 border-t flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center">
            SY
          </div>
          <div>
            <div className="font-medium">Sandeep</div>
            <div className="text-sm text-gray-500">Admin</div>
          </div>
        </div>
      </aside>
   </div>
  )
}

export default Slider

