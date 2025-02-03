import { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function loadTasks() {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
        nextId = JSON.parse(storedTasks).length;
      }
    }
    loadTasks();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  function handleClick() {
    if (name.trim() === '') return;
    
    const newTask = { id: nextId++, name, done: false };
    const newTasks = [newTask, ...tasks];
    
    setTasks(newTasks);
    setName('');
  }

  function handleToggle(id) {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    setTasks(updatedTasks);
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Tasks</Text>
      
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter task"
        style={{
          borderWidth: 1,
          padding: 10,
          marginVertical: 10,
          borderRadius: 5,
        }}
      />

      <TouchableOpacity
        onPress={handleClick}
        style={{
          backgroundColor: 'blue',
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Insert</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={task => task.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleToggle(item.id)}>
            <Text style={{
              fontSize: 18,
              padding: 10,
              textDecorationLine: item.done ? 'line-through' : 'none'
            }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
