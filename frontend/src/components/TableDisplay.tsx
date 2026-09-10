import { UNSTABLE_Table as Table, TextInput } from "@cfa/react-core";
import { Button } from "@cfa/react-core";
import { useState, useEffect } from "react";
import { Modal } from "@cfa/react-core";
import PostInput from "./PostInput";

interface Message {
  id: string;
  message: string;
  date: string;
  time: number;
}

interface EditMessageModalProps {
  message: Message;
  onConfirm: (id: string, text: string) => Promise<boolean>;
}

function EditMessageModal({ message, onConfirm }: EditMessageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState(message.message);
  const [updating, setUpdating] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setText(message.message);
    }
  };

  const handleConfirm = async () => {
    const trimmed = text.trim();
    if (!trimmed || updating) {
      return;
    }

    setUpdating(true);
    try {
      const ok = await onConfirm(message.id, trimmed);
      if (ok) {
        setIsOpen(false);
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal.Root isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Button>Edit</Button>
      <Modal.Dialog>
        <Modal.Content>
          <Modal.Title level={2}>Edit Message</Modal.Title>
          <p>Update the message with ID: {message.id}.</p>
          <TextInput
            label="Type in a message to enter!"
            placeholder="Hello..."
            value={text}
            onChange={setText}
          />
          <Modal.Footer>
            <Modal.CloseButton>Cancel</Modal.CloseButton>
            <Button
              onPress={handleConfirm}
              isDisabled={!text.trim() || updating}
            >
              {updating ? "Updating..." : "Confirm"}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Dialog>
    </Modal.Root>
  );
}

export default function TableDisplay() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const API_TOKEN = "123456789";
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

  const updateMessage = async (
    id: string,
    updatedMessage: Partial<Message>,
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(updatedMessage),
      });
      if (!response.ok) {
        throw new Error("Failed to update message");
      }
      //const updated: Message = await response.json();
      // Update the message in the state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id
            ? { ...msg, message: updatedMessage.message ?? msg.message }
            : msg,
        ),
      );
      return true;
    } catch (error) {
      console.error("Error updating message:", error);
      return false;
    }
  };

  const handlePosted = (message: Message) => {
    setMessages((prev) => [...(prev ?? []), message]);
  };

  useEffect(() => {
    fetchMessages();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PostInput onPosted={handlePosted} />
      <Table.Root aria-label="Message items">
        <Table.Header>
          <Table.Column isRowHeader>Item</Table.Column>
          <Table.Column>Message</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          {messages === null || messages.length === 0 ? (
            <Table.Row id="empty-row">
              <Table.Cell>No messages found</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          ) : (
            messages.map((msg) => (
              <Table.Row id={msg.id} key={msg.id}>
                <Table.Cell>{msg.id}</Table.Cell>
                <Table.Cell>{msg.message}</Table.Cell>
                <Table.Cell>
                  {new Date(msg.date).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <EditMessageModal
                    message={msg}
                    onConfirm={(id, text) =>
                      updateMessage(id, { message: text })
                    }
                  />
                  <Modal.Root>
                    <Button>Delete</Button>
                    <Modal.Dialog>
                      <Modal.Content>
                        <Modal.Title level={2}>Post Deletion</Modal.Title>
                        <p>
                          This will delete the message with ID: {msg.id}. Are
                          you sure you want to proceed?
                        </p>
                        <Modal.Footer>
                          <Modal.CloseButton>Cancel</Modal.CloseButton>
                          <Button onPress={() => deleteMessage(msg.id)}>
                            Delete
                          </Button>
                        </Modal.Footer>
                      </Modal.Content>
                    </Modal.Dialog>
                  </Modal.Root>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </>
  );
}
