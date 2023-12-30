import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import DataTable from "react-data-table-component";
import EventForm from "@/components/EventForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Event = () => {
  const [events, setEvents] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [activeButtonIndex, setActiveButtonIndex] = useState(null);

  const toggleEventStatus = async (eventId, newStatus) => {
    try {
      await axios.put(`/api/events?_id=${eventId}`, { onStatus: newStatus, _id: eventId });
      // Update the events state to reflect the change
      const updatedEvents = events.map((event) => {
        if (event._id === eventId) {
          return { ...event, OnStatus: newStatus };
        }
        return event;
      });
      setEvents(updatedEvents);
      // Show a success toast or feedback if desired
      toast.success(`Event ${newStatus === 1 ? "On" : "Off"} successfully!`);
    } catch (error) {
      console.error(error);
      // Show an error toast or feedback if the update fails
      toast.error("Failed to update event status.");
    }
  };

  const handleButtonClick = async (buttonIndex, eventId) => {
    if (activeButtonIndex === buttonIndex) {
      // Clicking the active button again turns it off
      setActiveButtonIndex(null);
      await toggleEventStatus(eventId, 0); // Turn off event
    } else {
      // Turn off the previously active button if there was any
      if (activeButtonIndex !== null) {
        await toggleEventStatus(events[activeButtonIndex]._id, 0);
      }
      setActiveButtonIndex(buttonIndex);
      await toggleEventStatus(eventId, 1); // Turn on event
    }
  };

  useEffect(() => {
    axios.get("/api/events").then((response) => {
      setEvents(response.data);
    });
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);
  };

  const filteredEvents = events.filter((event) =>
    event.name && event.name.toLowerCase().includes(searchValue)
  );

  const ImageCell = ({ value }) => {
    const imageStyles = {
      maxWidth: "50px",      // Adjust the width as needed
      maxHeight: "50px",     // Adjust the height as needed
      borderRadius: "50%",   // For rounded images
    };
  
    return <img src={value} alt="Event" style={imageStyles} />;
  };

  const handleBesideOrUpChange = async (eventId, newBesideOrUp) => {
    try {
      await axios.put(`/api/events?_id=${eventId}`, {
        besideOrUp: newBesideOrUp,
        _id: eventId,
      });
      // Update the events state to reflect the change
      const updatedEvents = events.map((event) => {
        if (event._id === eventId) {
          return { ...event, besideOrUp: newBesideOrUp };
        }
        return event;
      });
      setEvents(updatedEvents);
      // Show a success toast or feedback if desired
      toast.success(`Beside or Up updated successfully!`);
    } catch (error) {
      console.error(error);
      // Show an error toast or feedback if the update fails
      toast.error("Failed to update beside or up value.");
    }
  };
  
  const BesideOrUpCell = ({ row }) => {
    const besideOrUpText = row.besideOrUp === 0 ? "Beside" : "Up";

    return (
      <select
        value={row.besideOrUp}
        onChange={(e) => handleBesideOrUpChange(row._id, Number(e.target.value))}
      >
        <option value={0}>Beside</option>
        <option value={1}>Up</option>
      </select>
    );
  };

  const columns = [
    {
      name: "Event Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Image Path",
      selector: "image_path",
      sortable: true,
      cell: (row) => <ImageCell value={row.image_path} />, // Use the custom cell component
    },
    {
      name: "Status",
      selector: "OnStatus",
      sortable: true,
      cell: (row) => (row.OnStatus ? "On" : "Off"),
    },
    {
      name: "Beside or Up",
      selector: "besideOrUp",
      sortable: true,
      cell: (row) => <BesideOrUpCell row={row} />, // Use the custom cell component
    },
  ];

  return (
    <Layout>
      <div className="mb-2">
        {/* <EventForm /> */}
        <input
          type="text"
          placeholder="Search by event name..."
          onChange={handleSearch}
          className="mt-5"
        />
      </div>

      <div className="slider-container flex flex-grow flex-wrap">
        {events.map((event, index) => (
          <div key={index} className="slider-button-label">
            <button
              className={`slider-button ${
                activeButtonIndex === index ? "on" : "off"
              }`}
              onClick={() => handleButtonClick(index, event._id)}
            />
            <span className="slider-label">{event.name}</span>
          </div>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredEvents}
        pagination
        highlightOnHover
        noHeader
      />
    </Layout>
  );
};

export default Event;
