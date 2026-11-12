import { AppButton } from '@/components/AppButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useObjectives } from '@/hooks/use-objectives';
import { useTheme } from '@/hooks/use-theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';

export default function NewObjectiveScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { ajouterObjectif, loading } = useObjectives();
    const [name, setName] = useState<string>('');
    const [deadline, setDeadline] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [nameError, setNameError] = useState('');
    const [dateError, setDateError] = useState('');
    const [saveError, setSaveError] = useState('');
    const [saving, setSaving] = useState(false);

    async function handleCreateObjective() {
        const nameObjective = name.trim();
        setNameError('');
        setDateError('');
        setSaveError('');

        if (!nameObjective) {
            setNameError('Saisis le nom de ton objectif.');
            return;
        }

        if (!deadline) {
            setDateError("Choisis une date d'échéance.");
            return;
        }

        if (loading || saving) return;

        setSaving(true);
        try {
            const saved = await ajouterObjectif({
                name: nameObjective,
                dueDate: deadline,
                subObjectives: [],
            });

            if (!saved) {
                setSaveError('La sauvegarde a échoué. Réessaie.');
                return;
            }
            // reviens a l'ecran précédent si ca reussi 
            router.back();
        } catch (error) {
            console.error('Erreur lors de la création de l’objectif', error);
            setSaveError('Une erreur est survenue. Réessaie.');
        } finally {
            setSaving(false);
        }
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
                placeholder="Ex. : apprendre React"
                placeholderTextColor={theme.textSecondary}
                accessibilityLabel="Nom de l'objectif"
                onChangeText={(value) => {
                    setName(value);
                    if (value.trim()) setNameError('');
                }}
            />
            {/* s'il existe une erreur  */}
            {nameError !== '' && (
                <ThemedText style={styles.errorText}>{nameError}</ThemedText>
            )}
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
                        if (selectedDate) {
                            setDeadline(selectedDate);
                            setDateError('');
                        }
                        setShowDatePicker(false);
                    }}
                    onDismiss={() => setShowDatePicker(false)}
                />
            )}
            {dateError !== '' && (
                <ThemedText style={styles.errorText}>{dateError}</ThemedText>
            )}

            <AppButton 
                title={saving ? 'Enregistrement...' : 'Créer l’objectif'}
                variant="primary"
                accessibilityLabel="Créer l'objectif"
                onPress={() => void handleCreateObjective()}
                style={styles.addButton}
            />
            {saveError !== '' && (
                <ThemedText style={styles.errorText}>{saveError}</ThemedText>
            )}

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
    errorText: {
        color: '#DC2626',
        marginBottom: 16,
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