import { UNSTABLE_Table as Table } from "@cfa/react-core";
import { Button } from "@cfa/react-core";
import React, { useState, useEffect } from "react";

//Why is data not being displayed?

interface Message {
  id: string;
  message: string;
  date: string;
  time: number;
}

export default function TableDisplay() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const API_TOKEN = "123456789";
  //Double check this
  const API_URL = "http://localhost:8080/messages";

  const fetchMessages = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
      try {
          const response = await fetch(`${API_URL}/${id}`, {
              method: "DELETE",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${API_TOKEN}`,
              },
          });
          if (!response.ok) {
              throw new Error("Failed to delete message");
          }
          // Remove the deleted message from the state
          setMessages(messages.filter((msg) => msg.id !== id));
      } catch (error) {
          console.error("Error deleting message:", error);
      }
  };

  useEffect(() => {
    fetchMessages();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  //USE THIS FOR MESSAGE DISPLAY, must hook up to api
  //also maybe have delete button displyed on each post here.
  return (
    <Table.Root aria-label="Message items">
      <Table.Header>
        <Table.Column isRowHeader>Item</Table.Column>
        <Table.Column>Message</Table.Column>
        <Table.Column>Date</Table.Column>
        <Table.Column>Actions</Table.Column>
      </Table.Header>
      <Table.Body>
       {messages.length === 0 ? (
          <Table.Row id="empty-row">
            <Table.Cell>No messages found</Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>
        ) : (
            //implement variables in other api calls deinfed on table
          messages.map((msg) => (
            <Table.Row id={msg.id} key={msg.id}>
              <Table.Cell>{msg.id}</Table.Cell>
              <Table.Cell>{msg.message}</Table.Cell>
              <Table.Cell>{new Date(msg.date).toLocaleDateString()}</Table.Cell>
              <Table.Cell>
                <Button onPress={() => deleteMessage(msg.id)}>Delete</Button>
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table.Root>
  );
}
