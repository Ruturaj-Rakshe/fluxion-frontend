"use client"
import FilledwithCards from "../../../components/pages/filledwithcards";

 import {motion} from 'framer-motion'

export default function browsingPage() {
    return <div className="bg-black"> 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FilledwithCards />
        </motion.div>
        
    </div>
}