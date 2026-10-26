import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Pressable, TextInput } from 'react-native';
export default function NewObjectiveScreen(){
    const [name,setName] = useState('');
    const [deadline,setDeadline] = useState<Date | null>(null);
    const [showDatePicker,setShowDatePicker] = useState(false)
    return(
        <ThemedView>
            <ThemedText>Nouvelle Objectives </ThemedText>
            <ThemedText>Nom de l'objective</ThemedText>
            <TextInput 
                value={name}
                onChangeText={setName}
                placeholder='ex: apprendre react'
            />
            {/* date */}
            <ThemedText>Date d'echeance</ThemedText>
            <Pressable onPress={()=> setShowDatePicker(true)}>
                <ThemedText>
                    {deadline ? deadline.toLocaleDateString('fr-FR') : "Choisir une date"}
                </ThemedText>
            </Pressable>
            {showDatePicker &&(
                <DateTimePicker 
                    value={deadline ?? new Date()}
                    mode="date"
                    onValueChange={(_event, selectedDate)=>{
                        if(selectedDate) setDeadline(selectedDate);
                        setShowDatePicker(false)
                    }}
                    onDismiss={()=>setShowDatePicker(false)}
                />
            )}

        </ThemedView>
    )
}