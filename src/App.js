
import {BiArchive} from "react-icons/bi";
import Search from './components/Search'
import AddAppointment from "./components/AddAppointment";
import AppointmentInfo from "./components/AppointmentInfo";
import {useCallback, useEffect, useState} from "react";

function App() {

    let [appointmentList, setAppointmentList] = useState([]);
    const [query,setQuery] = useState("")

    let [sortBy,setSortBy] = useState("petName");
    let [orderBy,setOrderBy] = useState("asc");



    const filteredAppointments = appointmentList.filter( (item) =>
        (
                item.petName.toLowerCase().includes(query.toLowerCase()) ||
                item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
                item.aptNotes.toLowerCase().includes(query.toLowerCase())
        )

    ).sort((a, b) => {
        let order = (orderBy === 'asc') ? 1 : -1;
        return (
            a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
                ? -1 * order : 1 * order
        )
    })




    const fetchData = useCallback(() => {
        fetch('./data.json')
            .then(response => response.json())
            .then(data => {
                setAppointmentList(data)
            });
    }, [])

    // tracking the data any change it comes data  And this is how you would actually work with a traditional API.
    // So if the data changes for some reason, useEffect we'll keep track of it and update our application automatically.
    useEffect(() => {
        fetchData()
    }, [fetchData]);




    return (
        <div className="App container mx-auto mt-3 font-thin">
            <h1 className="text-5xl">
                <BiArchive className="inline-block text-blue-800 align-top"/>
                Your Appointments
            </h1>

            <AddAppointment

                /*  take the current appointment list and pass along my appointment it almost like push like add something in the
                *  current array */
                onSendAppointment={ (myAppointment => setAppointmentList([...appointmentList,myAppointment]))}
                lastId = {appointmentList.reduce((max,item) => Number(item.id) > max ? Number(item.id) : max,0 )}
            />

            <Search query={query}
                    onQueryChange={myQuery => setQuery(myQuery)}


                    orderBy={orderBy}
                    onOrderByChange={ mySort => setOrderBy(mySort)}
                    sortBy={sortBy}
                    onSortByChange={mySort => setSortBy(mySort)}
            />




            <ul className="divide-y divide-gray-200">
                {
                    filteredAppointments.map( (appointment) => (
                        <AppointmentInfo
                            key ={appointment.id}
                            petName={appointment.petName}
                            aptDate = {appointment.aptDate}
                            ownerName = {appointment.ownerName}
                            aptNotes = {appointment.aptNotes}
                            id = { appointment.id }
                            onDeleteAppointment={
                                (appointmentId) => // 1
                                    setAppointmentList(appointmentList.filter((appointment) =>
                                        // return the value that not equal to when a button is click
                                     appointment.id !== appointmentId // 1
                                    ))

                            }
                        />
                    ))
                }
            </ul>
        </div>
    );
}





export default App;
