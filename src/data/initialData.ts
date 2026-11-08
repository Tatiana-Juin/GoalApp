import type { Objective } from '../types/goal';

// Initialisation des objectifs
export const initialObjectives: Objective[] = [
    {id:"1", name:'Atteindre 11k sur Tiktok', dueDate: new Date('2026-12-31'), completed:false, 
        subObjectives:[
         {id:"1", name:'atteindre 10950 abonnés', completed:true},
         {id:"2", name:'atteindre 10970 abonnés',  completed:false},
         {id:"3", name:'atteindre 11K abonnés', completed:false},
    ]},
    {id:"2", name:'Atteindre 11k sur Tiktok', dueDate: new Date('2026-12-31'), completed:false,  
        subObjectives:[
         {id:"1", name:'atteindre 10950 abonnés',  completed:false},
    ]},
    {id:"3", name:'Atteindre 11k sur Tiktok', dueDate: new Date('2026-12-31'), completed:false, 
        subObjectives:[
         {id:"1", name:'atteindre 10950 abonnés',  completed:false},
    ]},
    
];




