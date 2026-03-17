import React from 'react'

const Greeting = () => {
    let greeting;
    const currentHour = new Date().getHours()
    if (currentHour < 12) {
        greeting = "Good morning"
    } else if (currentHour > 12 && currentHour < 18) {
        greeting = "Good afternoon "
    }
    else {
        greeting = "Good evening "
    }
    return (
        <div>
            <span>{greeting}</span>
        </div>
    )
}

export default Greeting
