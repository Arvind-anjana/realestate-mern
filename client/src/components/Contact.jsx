import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                if (data.success === false) {
                    setLandlord(null);
                    return;
                }
                setLandlord(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchLandlord();
    })

    const onChange = (e) => {
        setMessage(e.target.value);
    };
    return (
        <>
            {landlord && <div className="flex flex-col gap-4 m-2">
                <p>Contact <span className="font-semibold text-slate-700">{landlord.username + " "}</span>
                    for <span className="font-semibold">{listing.name.toLowerCase()}</span></p>
                <textarea onChange={onChange} name="message" id="message" rows={2} placeholder="Enter your message"
                    className="w-full border border-2 border-slate-500 rounded-lg p-3"></textarea>

                <a href={`mailto:${landlord.email}?subject=Regarding ${listing.name} &body=${message}`}
                    target="_blank" rel="noopener noreferrer"
                    className="bg-slate-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-95">
                    Send message
                </a>
            </div>}
        </>
    )
}