import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import axios from "axios";

export default function Index() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [users, setUsers] = useState([]);

  // 👉 Replace this with your local IPv4 address (from ipconfig)
  const API_URL = "http://10.50.4.236:5000";

  const addUser = async () => {
    try {
      await axios.post(`${API_URL}/users`, { name, email, age: Number(age) });
      alert("User added!");
      setName(""); setEmail(""); setAge("");
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
    } catch (err) {
      alert("Error fetching users");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add User</Text>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
      <Button title="Submit" onPress={addUser} />

      <View style={{ marginVertical: 20 }}>
        <Button title="Fetch Users" onPress={fetchUsers} />
      </View>

      <FlatList
        data={users}
        keyExtractor={(item, index) => item._id?.toString() || item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <Text>{item.name} - {item.email} - {item.age}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      marginTop: 50,
      backgroundColor: "#fff",   //  white background
    },
    header: {
      fontSize: 20,
      marginBottom: 10,
      fontWeight: "bold",
      color: "#000",             // black text
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",       // light grey border
      marginBottom: 10,
      padding: 8,
      borderRadius: 5,
      backgroundColor: "#f9f9f9", // light input background
      color: "#000",             // text inside input visible
    },
  });
  
