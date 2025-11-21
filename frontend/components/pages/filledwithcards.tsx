"use client"
import { Navbar } from "../Navbarr";
import { ThreeDCardDemo } from "../pinCards";

export default function FilledwithCards() {
    return (
        <>  
            <Navbar/>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                <ThreeDCardDemo />
                <ThreeDCardDemo />
                <ThreeDCardDemo />
            </div>
        </>
    )
}