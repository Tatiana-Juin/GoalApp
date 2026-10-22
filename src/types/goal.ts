// Interface pour les catégories d'objectifs
export interface Category{
    id: string;
    name:string;
}

// Interface pour les objectifs 
export interface Objective{
    id: string;
    name:string;
    description?:string;
    dueDate: Date;
    completed:boolean;
    categoryId:string;
    subObjectives: SubObjective[];
}

// Interface pour les sous-objectifs
export interface SubObjective{
    id: string;
    name:string;
    date?: Date;
    completed:boolean;
    // objective:Objective[];
    
}