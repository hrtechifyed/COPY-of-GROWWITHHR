/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Compliance Intelligence Validator
 * -----------------------------------------------------------------------------
 * File      : js/modules/compliance/validator.js
 * Version   : 1.0.0
 * =============================================================================
 */

class ComplianceValidator {

    validate(company = {}) {

        const errors = [];

        this.validateCompany(company, errors);
        this.validateIndustry(company, errors);
        this.validateGeography(company, errors);
        this.validateWorkforce(company, errors);
        this.validateOrganization(company, errors);
        this.validateBusiness(company, errors);
        this.validateCompliance(company, errors);

        return {
            valid: errors.length === 0,
            errors
        };

    }

    validateCompany(company, errors) {

        if (!company.company) {
            errors.push("Company section missing.");
            return;
        }

        if (!company.company.legalName) {
            errors.push("Legal name is required.");
        }

        if (!company.company.entityType) {
            errors.push("Entity type is required.");
        }

    }

    validateIndustry(company, errors) {

        if (!company.industry) {
            errors.push("Industry section missing.");
            return;
        }

        if (!company.industry.sector) {
            errors.push("Industry sector is required.");
        }

    }

    validateGeography(company, errors) {

        if (!company.geography) {
            errors.push("Geography section missing.");
            return;
        }

        const headquarters = company.geography.headquarters;

        if (!headquarters) {
            errors.push("Headquarters information missing.");
            return;
        }

        if (!headquarters.country) {
            errors.push("Country is required.");
        }

        if (!headquarters.state) {
            errors.push("State is required.");
        }

        if (!headquarters.city) {
            errors.push("City is required.");
        }

    }

    validateWorkforce(company, errors) {

        if (!company.workforce) {
            errors.push("Workforce section missing.");
            return;
        }

        if (
            typeof company.workforce.totalEmployees !== "number"
        ) {
            errors.push("Total employees must be numeric.");
        }

        if (
            company.workforce.totalEmployees < 0
        ) {
            errors.push("Total employees cannot be negative.");
        }

    }

    validateOrganization(company, errors) {

        if (!company.organization) {
            errors.push("Organization section missing.");
            return;
        }

        if (!Array.isArray(company.organization.departments)) {
            errors.push("Departments should be an array.");
        }

        if (!Array.isArray(company.organization.branches)) {
            errors.push("Branches should be an array.");
        }

        if (!Array.isArray(company.organization.factories)) {
            errors.push("Factories should be an array.");
        }

    }

    validateBusiness(company, errors) {

        if (!company.business) {
            errors.push("Business section missing.");
            return;
        }

        if (!company.business.businessModel) {
            errors.push("Business model is required.");
        }

        if (!company.business.growthStage) {
            errors.push("Growth stage is required.");
        }

    }

    validateCompliance(company, errors) {

        if (!company.compliance) {
            errors.push("Compliance section missing.");
            return;
        }

        if (!Array.isArray(company.compliance.registrations)) {
            errors.push("Registrations should be an array.");
        }

        if (!Array.isArray(company.compliance.licenses)) {
            errors.push("Licenses should be an array.");
        }

        if (!Array.isArray(company.compliance.policies)) {
            errors.push("Policies should be an array.");
        }

    }

}

const complianceValidator =
    new ComplianceValidator();

export { ComplianceValidator };

export default complianceValidator;
