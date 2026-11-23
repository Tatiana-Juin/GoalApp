import { ScrollView, StyleSheet, TextInput, View,Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams,useRouter } from 'expo-router';
import { useObjectives } from '@/hooks/use-objectives';
import { AppButton } from '@/components/AppButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ActionColors, Spacing } from '@/constants/theme';
import { formStyles } from '@/constants/form-styles';
import { useTheme } from '@/hooks/use-theme';
import { useState,useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function EditObjectiveScreen() {

  const theme = useTheme();
  const router = useRouter();
  const fieldStyle = {
    backgroundColor: theme.backgroundElement,
    borderColor: theme.textSecondary,
  };
    const { objectiveId } = useLocalSearchParams<{ objectiveId: string }>();
    const { objectives, loading,updatedObjective } = useObjectives();
    const objective = objectives.find((item) => item.id === objectiveId);

    // POUR LA DATE 
    // pour savoir si c'est ouvert
    const [showDatePicker, setShowDatePicker] = useState(false);
    // pour recuperer la date 
     const [deadline, setDeadline] = useState<Date | null>(null);
      const [dateError, setDateError] = useState('');
      const [name,setName] =  useState("");
      const [nameError,setNameError]= useState("");
       const [saving, setSaving] = useState(false);
       const [saveError, setSaveError] = useState('');
     

      // Au chargement pour recuperer le nom et le placer dans le useState
      useEffect(()=>{
        if(objective){
          setName(objective.name)
        }
      },[objective])

    // verifie que ca charge si c'est le cas on dit que ca charge 
     if (loading) {
        return (
          <ThemedView style={formStyles.notFound}>
            <ThemedText>Chargement de l’objectif...</ThemedText>
          </ThemedView>
        );
      }
      // sinon objective introuvable
      if (!objective) {
        return (
          <ThemedView style={formStyles.notFound}>
            <ThemedText>Objectif introuvable</ThemedText>
          </ThemedView>
        );
      }

      async function handleUpdatedObjective(){
        // erreur si l'objectifs existe pas 
        if (!objective) return;
        const nameObjective = name.trim();
        setNameError("");
        setDateError("");
        setSaveError("");

        if(!nameObjective){
          setNameError("Il faut que tu choisi le nom pour la modification");
          return;
        }

        if(loading || saving) return;

        setSaving(true)
        try{
          const saved = await updatedObjective(
            objective.id,
            nameObjective,
             deadline ?? objective.dueDate
);
          if(!saved){
            setSaveError("La modification à echouer");
            return;
          }
          router.back()
        } catch(error){
            console.error("Erreur lors de la modification de l'objectifs", error);
            setSaveError('Une erreur est survenue. Réessaie.');
        }finally{
          setSaving(false)
        }
        
      }

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ThemedText style={styles.title}>Modifier l’objectif</ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            Mets à jour les informations de ton objectif.
          </ThemedText>
          
          {/* Nom  */}
          <ThemedText style={styles.label}>Nom de l’objectif</ThemedText>
          <TextInput
           value={name}
           onChangeText={setName}
            style={[formStyles.inputBase, styles.input, fieldStyle, { color: theme.text }]}
            placeholder={objective.name}
            placeholderTextColor={theme.textSecondary}
            accessibilityLabel="Nom de l’objectif"
           
            
          />

          <ThemedText style={styles.label}>Date d’échéance</ThemedText>
          <Pressable onPress={() => setShowDatePicker(true)}
                accessibilityRole="button"
                accessibilityLabel="Choisir la date d'échéance">
            <View
            style={[
              styles.dateField,
              formStyles.dateFieldBase,
              fieldStyle,
            ]}
            accessibilityLabel="Date d’échéance"
          >
            <ThemedText style={{ color: theme.textSecondary }}>
              {(deadline ??objective.dueDate).toLocaleDateString('fr-FR')}
            </ThemedText>
            <ThemedText style={[formStyles.dateAction, styles.dateAction]}>Calendrier</ThemedText>
          </View>
          </Pressable>
          {/* c'est pour pouvoir cliquer sur le calendrier */}
           {showDatePicker && (
                <DateTimePicker
                    value={(deadline ?? objective.dueDate)}
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
          

          <View style={styles.actions}>
            <AppButton
              title="Enregistrer les modifications"
              onPress={() => handleUpdatedObjective()}
              style={formStyles.actionButton}
            />
            <AppButton
              title="Annuler"
              variant="secondary"
              onPress={() => router.back()}
              style={formStyles.actionButton}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: Spacing.four,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.two,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: Spacing.five,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.two,
  },
  input: {
    minHeight: 52,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.four,
  },
  dateField: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    marginBottom: Spacing.five,
  },
  dateAction: {
    color: ActionColors.primary,
  },
  actions: {
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
});
