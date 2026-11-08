// Interface pour les objectifs 
export interface Objective{
    id: string;
    name:string;
    dueDate: Date;
    completed:boolean;
    subObjectives?: SubObjective[];
}

// Interface pour les sous-objectifs
export interface SubObjective{
    id: string;
    name:string;
    completed:boolean;
    // objective:Objective[];  
}