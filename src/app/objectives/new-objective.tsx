import { AppButton } from '@/components/AppButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useObjectives } from '@/hooks/use-objectives';
import { useTheme } from '@/hooks/use-theme';
import { FontSizes, Spacing } from '@/constants/theme';
import { formStyles } from '@/constants/form-styles';
import { layoutStyles } from '@/constants/layout-styles';
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
        <ThemedView style={[layoutStyles.flexFill, styles.container]}>
            {/* nom de la page  */}
            <ThemedText style={[formStyles.formTitle, styles.title]}>Nouvel objectif</ThemedText>
            {/* NOM DE L'OBJECTIF */}
            <ThemedText style={formStyles.formLabel}>Nom de l'objectif</ThemedText>
            <TextInput
                style={[
                    formStyles.inputBase,
                    formStyles.objectiveInput,
                    styles.input,
                    fieldStyle,
                    { color: theme.text },
                ]}
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
                <ThemedText style={formStyles.errorText}>{nameError}</ThemedText>
            )}
            {/* DATE D'ECHEANCE  */}
            <ThemedText style={formStyles.formLabel}>Date d'échéance </ThemedText>
            <Pressable
                style={[formStyles.dateFieldBase, styles.dateField, fieldStyle]}
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
                <ThemedText style={formStyles.dateAction}>Ouvrir le calendrier</ThemedText>
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
                <ThemedText style={formStyles.errorText}>{dateError}</ThemedText>
            )}

            <AppButton 
                title={saving ? 'Enregistrement...' : 'Créer l’objectif'}
                variant="primary"
                accessibilityLabel="Créer l'objectif"
                onPress={() => void handleCreateObjective()}
                style={formStyles.actionButton}
            />
            {saveError !== '' && (
                <ThemedText style={formStyles.errorText}>{saveError}</ThemedText>
            )}

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Spacing.four,
    },
    title: {
        marginBottom: Spacing.four,
    },
    input: {
        paddingHorizontal: 14,
    },
    dateField: {
        paddingHorizontal: 14,
        gap: 12,
        marginBottom: Spacing.four,
    },
    dateText: {
        fontSize: FontSizes.body,
        flexShrink: 1,
    },
});