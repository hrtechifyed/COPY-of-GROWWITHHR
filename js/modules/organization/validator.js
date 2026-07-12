/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Organization Intelligence Validator
 * -----------------------------------------------------------------------------
 * File      : js/modules/organization/validator.js
 * Version   : 1.0.0
 * =============================================================================
 */

class OrganizationValidator {

    validate(company = {}) {

        const errors = [];

        this.validateOrganization(company, errors);
        this.validateDepartments(company, errors);
        this.validateHierarchy(company, errors);
        this.validateBusinessUnits(company, errors);
        this.validateLocations(company, errors);

        return {
            valid: errors.length === 0,
            errors
        };

    }

    validateOrganization(company, errors) {

        if (!company.organization) {

            errors.push(
                "Organization section missing."
            );

        }

    }

    validateDepartments(company, errors) {

        const departments =
            company.organization?.departments;

        if (!Array.isArray(departments)) {

            errors.push(
                "Departments must be an array."
            );

            return;

        }

        if (departments.length === 0) {

            errors.push(
                "At least one department is required."
            );

        }

    }

    validateHierarchy(company, errors) {

        const reportingLevels =
            company.organization?.reportingLevels;

        if (typeof reportingLevels !== "number") {

            errors.push(
                "Reporting levels must be numeric."
            );

            return;

        }

        if (reportingLevels < 1) {

            errors.push(
                "Reporting hierarchy is required."
            );

        }

    }

    validateBusinessUnits(company, errors) {

        const businessUnits =
            company.organization?.businessUnits;

        if (!Array.isArray(businessUnits)) {

            errors.push(
                "Business units must be an array."
            );

            return;

        }

        if (
            company.workforce?.totalEmployees >= 250 &&
            businessUnits.length === 0
        ) {

            errors.push(
                "Business units recommended for organizations with 250+ employees."
            );

        }

    }

    validateLocations(company, errors) {

        if (
            !Array.isArray(
                company.organization?.branches
            )
        ) {

            errors.push(
                "Branches must be an array."
            );

        }

        if (
            !Array.isArray(
                company.organization?.factories
            )
        ) {

            errors.push(
                "Factories must be an array."
            );

        }

        if (
            !Array.isArray(
                company.organization?.offices
            )
        ) {

            errors.push(
                "Offices must be an array."
            );

        }

    }

}

const organizationValidator =
    new OrganizationValidator();

export { OrganizationValidator };

export default organizationValidator;
