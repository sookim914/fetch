import React, { useState, useEffect } from "react";
import { Modal, Card, Spin, message } from "antd";

const DogInfoModal = ({ visible, dogId, onClose }) => {
  const [dogDetails, setDogDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "https://frontend-take-home-service.fetch.com";
  const token = "your-auth-token"; 

  useEffect(() => {
    if (visible && dogId) {
      fetchDogDetails(dogId);
    }
  }, [visible, dogId]);

  const fetchDogDetails = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/dogs`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify([id]), 
      });

      if (!response.ok) {
        throw new Error(`Error fetching dog details: ${response.statusText}`);
      }

      const data = await response.json();
      if (data && data.length > 0) {
        setDogDetails(data[0]); 
      } else {
        message.error("Dog details not found.");
      }
    } catch (error) {
      setError(error);
      message.error("Failed to fetch dog details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Dog Information"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <p>{error.message}</p>
      ) : (
        dogDetails && (
          <Card
            hoverable
            cover={<img alt={dogDetails.name} src={dogDetails.img} style={{ height: "200px", objectFit: "cover" }} />}
          >
            <Card.Meta
              title={dogDetails.name}
              description={
                <>
                  <p>Breed: {dogDetails.breed}</p>
                  <p>Age: {dogDetails.age}</p>
                  <p>Location: {dogDetails.zip_code}</p>
                </>
              }
            />
          </Card>
        )
      )}
    </Modal>
  );
};

export default DogInfoModal;
