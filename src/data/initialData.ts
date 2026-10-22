import  type { Category,Objective,SubObjective } from '../types/goal';

// Initialisation des categories d'objectifs
export const initialCategories: Category[] = [
    { id: '1', name: 'sans catégorie' },
    {id: '2', name: 'personnel'},
    {id: '3', name: 'programmation'},
    {id: '4', name: 'tiktok'},
];

// Initialisation des objectifs
export const initialObjectives: Objective[] = [
    {id:"1", name:'Atteindre 11k sur Tiktok', dueDate: new Date('2026-12-31'), completed:false, categoryId:'4', 
        subObjectives:[
         {id:"1", name:'atteindre 10950 abonnés', date: new Date('2026-12-31'), completed:true},
         {id:"2", name:'atteindre 10970 abonnés', date: new Date('2026-12-31'), completed:false},
         {id:"3", name:'atteindre 11K abonnés', date: new Date('2026-12-31'), completed:false},
    ]},
    {id:"2", name:'Atteindre 11k sur Tiktok', dueDate: new Date('2026-12-31'), completed:false, categoryId:'4', 
        subObjectives:[
         {id:"1", name:'atteindre 10950 abonnés', date: new Date('2026-12-31'), completed:false},
    ]},
    {id:"3", name:'Atteindre 11k sur Tiktok', dueDate: new Date('2026-12-31'), completed:false, categoryId:'4', 
        subObjectives:[
         {id:"1", name:'atteindre 10950 abonnés', date: new Date('2026-12-31'), completed:false},
    ]},
    
];


