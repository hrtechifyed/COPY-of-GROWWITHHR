class RequirementsEngine {

    constructor(company, requirements) {

        this.company = company;

        this.requirements = requirements || [];

    }

    evaluate() {

        const result = {

            mandatory: [],

            recommended: [],

            notYetApplicable: []

        };

        for (const requirement of this.requirements) {

            const applicable = this.isApplicable(requirement);

            if (applicable) {

                if (requirement.classification === "Mandatory") {

                    result.mandatory.push(requirement);

                } else {

                    result.recommended.push(requirement);

                }

            } else {

                result.notYetApplicable.push(requirement);

            }

        }

        return result;

    }

    isApplicable(requirement) {

        if (!requirement.conditions || requirement.conditions.length === 0) {

            return true;

        }

        for (const condition of requirement.conditions) {

            if (!this.evaluateCondition(condition)) {

                return false;

            }

        }

        return true;

    }

    evaluateCondition(condition) {

        const value = this.getCompanyValue(condition.field);

        switch (condition.operator) {

            case "=":
                return value === condition.value;

            case "!=":
                return value !== condition.value;

            case ">":
                return value > condition.value;

            case ">=":
                return value >= condition.value;

            case "<":
                return value < condition.value;

            case "<=":
                return value <= condition.value;

            case "includes":
                return Array.isArray(value) && value.includes(condition.value);

            default:
                return false;

        }

    }

    getCompanyValue(field) {

        switch (field) {

            case "entityType":
                return this.company.company.entityType;

            case "industry":
                return this.company.company.industry;

            case "workModel":
                return this.company.company.workModel;

            case "countries":
                return this.company.company.countries;

            case "states":
                return this.company.company.states;

            case "cities":
                return this.company.company.cities;

            case "permanent":
                return this.company.company.workforce.permanent;

            case "contract":
                return this.company.company.workforce.contract;

            case "interns":
                return this.company.company.workforce.interns;

            case "apprentices":
                return this.company.company.workforce.apprentices;

            case "consultants":
                return this.company.company.workforce.consultants;

            case "gigWorkers":
                return this.company.company.workforce.gigWorkers;

            case "totalEmployees":
                return this.company.getTotalEmployees();

            case "projectedEmployees":
                return this.company.company.growth.projectedEmployees;

            case "internationalHiring":
                return this.company.company.growth.internationalHiring;

            case "expandingStates":
                return this.company.company.growth.expandingStates;

            default:
                return null;

        }

    }

}
