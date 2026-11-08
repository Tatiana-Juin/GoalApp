import { AppButton } from '@/components/AppButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';


const CLE_OBJECTIVE : string = "objective";
export default function NewObjectiveScreen() {
    const theme = useTheme();
    const [name, setName] = useState<string>('');
    const [subObjective,setSubObjective] = useState<string>("");
    // POUR LA DATE 
    const [deadline, setDeadline] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateError,setDateError] = useState<string>("");
    // tableau pour ajouter un objectifs
    const [objective,setObjective] = useState<string[]>([]);

    // CREATION DE L'OBJET
    // const objectObjective : Objective={
    //     id:creerIdUnique(objective)
    // }
   
    // POUR LA VERIFICATION DE L'AJOUT D'UN OBJECTIF
    async function ajouterObjectif(){
        const nameObjective = name.trim();
        // si c'est vide ca retourne 
        if(!nameObjective) return;

        if(!deadline){
            setDateError("choisi une date d'echeance");
            return;
        }

        // const newObjective = [...objective,nameObjective,deadline]
        setDateError("");
    }
    

    // POUR LE STYLE 
    const fieldStyle = {
        backgroundColor: theme.backgroundElement,
        borderColor: theme.textSecondary,
    };

    return (
        <ThemedView style={styles.container}>
            {/* nom de la page  */}
            <ThemedText style={styles.title}>Nouvel objectif</ThemedText>
            {/* NOM DE L'OBJECTIF */}
            <ThemedText style={styles.label}>Nom de l'objectif</ThemedText>
            <TextInput
                style={[styles.input, fieldStyle, { color: theme.text }]}
                value={name}
                onChangeText={setName}
                placeholder="Ex. : apprendre React"
                placeholderTextColor={theme.textSecondary}
                accessibilityLabel="Nom de l'objectif"
            />
            {/* DATE D'ECHEANCE  */}
            <ThemedText style={styles.label}>Date d'échéance </ThemedText>
            <Pressable
                style={[styles.dateField, fieldStyle]}
                onPress={() => setShowDatePicker(true)}
                accessibilityRole="button"
                accessibilityLabel="Choisir la date d'échéance"
            >
                <ThemedText
                    style={[
                        styles.dateText,
                        { color: deadline ? theme.text : theme.textSecondary },
                    ]}
                >
                    {deadline ? deadline.toLocaleDateString('fr-FR') : 'Choisir une date'}
                </ThemedText>
                <ThemedText style={styles.dateAction}>Ouvrir le calendrier</ThemedText>
            </Pressable>

            {showDatePicker && (
                <DateTimePicker
                    value={deadline ?? new Date()}
                    mode="date"
                    onValueChange={(_event, selectedDate) => {
                        if (selectedDate) setDeadline(selectedDate);
                        setShowDatePicker(false);
                    }}
                    onDismiss={() => setShowDatePicker(false)}
                />
            )}

            

            {/* POUR AJOUTER UNE ETAPE FACULTATIF  */}
            <ThemedText style={styles.label}>Sous objectifs (étapes) facultatives</ThemedText>
            <TextInput
                style={[styles.input, fieldStyle, { color: theme.text }]}
                value={subObjective}
                onChangeText={setSubObjective}
                placeholder="Ex : apprendre useState"
                placeholderTextColor={theme.textSecondary}
                accessibilityLabel="Sous objectifs (étapes) falcutatives"
            />
            <AppButton 
                title="Créer l'objectif"
                variant="primary"
                accessibilityLabel="Créer l'objectif"
                onPress={()=>{}}
                style={styles.addButton}
            />

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 24,
    },
    label: {
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        minHeight: 52,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 14,
        fontSize: 16,
        marginBottom: 24,
    },
    dateField: {
        minHeight: 52,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 24,
    },
    dateText: {
        fontSize: 16,
        flexShrink: 1,
    },
    dateAction: {
        fontSize: 14,
        fontWeight: '600',
    },
    categoryList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        paddingBottom: 24,
    },
    categoryButton: {
        minHeight: 36,
        borderWidth: 1,
        borderRadius: 18,
        paddingHorizontal: 12,
        justifyContent: 'center',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
    },
     addButton: {
     minHeight: 48,
    justifyContent: 'center',
  },
});