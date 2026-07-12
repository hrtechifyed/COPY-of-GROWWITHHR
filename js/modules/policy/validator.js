/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Policy Intelligence Validator
 * -----------------------------------------------------------------------------
 * File      : js/modules/policy/validator.js
 * Version   : 1.0.0
 * =============================================================================
 */

class PolicyValidator {

    validate(company = {}) {

        const errors = [];

        this.validateCompany(company, errors);
        this.validateOrganization(company, errors);
        this.validateWorkforce(company, errors);
        this.validateBusiness(company, errors);

        return {

            valid: errors.length === 0,

            errors

        };

    }

    validateCompany(company, errors) {

        if (!company.company) {

            errors.push(
                "Company information is missing."
            );

            return;

        }

        if (!company.company.legalName) {

            errors.push(
                "Legal company name is required."
            );

        }

        if (!company.company.entityType) {

            errors.push(
                "Entity type is required."
            );

        }

    }

    validateOrganization(company, errors) {

        if (!company.organization) {

            errors.push(
                "Organization information is missing."
            );

            return;

        }

        if (
            !Array.isArray(
                company.organization.departments
            )
        ) {

            errors.push(
                "Departments must be an array."
            );

        }

        if (
            typeof company.organization.reportingLevels !==
            "number"
        ) {

            errors.push(
                "Reporting levels must be numeric."
            );

        }

    }

    validateWorkforce(company, errors) {

        if (!company.workforce) {

            errors.push(
                "Workforce information is missing."
            );

            return;

        }

        if (
            typeof company.workforce.totalEmployees !==
            "number"
        ) {

            errors.push(
                "Employee count must be numeric."
            );

        }

        if (
            company.workforce.totalEmployees < 0
        ) {

            errors.push(
                "Employee count cannot be negative."
            );

        }

    }

    validateBusiness(company, errors) {

        if (!company.business) {

            errors.push(
                "Business information is missing."
            );

            return;

        }

        if (!company.business.businessModel) {

            errors.push(
                "Business model is required."
            );

        }

        if (!company.business.growthStage) {

            errors.push(
                "Growth stage is required."
            );

        }

    }

}

const policyValidator =
    new PolicyValidator();

export { PolicyValidator };

export default policyValidator;
