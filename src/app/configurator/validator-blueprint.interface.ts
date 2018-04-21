export interface ValidatorBlueprint {
    name: string;
    validatorType: string;
    appliesTo: string[];
    requiresValue: boolean;
}
