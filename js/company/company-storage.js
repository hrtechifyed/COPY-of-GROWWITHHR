class CompanyStorage {

    constructor() {

        this.storageKey = "growwithhr.company";

    }

    save(company) {

        const validation = this.validate(company);

        if (!validation.valid) {

            return validation;

        }

        try {

            localStorage.setItem(

                this.storageKey,

                JSON.stringify(company)

            );

            return {

                valid: true,

                message: "Organization Profile saved successfully."

            };

        }

        catch (error) {

            return {

                valid: false,

                message: error.message

            };

        }

    }

    load() {

        const data = localStorage.getItem(this.storageKey);

        if (!data) {

            return null;

        }

        return JSON.parse(data);

    }

    exists() {

        return localStorage.getItem(this.storageKey) !== null;

    }

    clear() {

        localStorage.removeItem(this.storageKey);

    }

    validate(company) {

        if (!company.companyName) {

            return {

                valid: false,

                message: "Organization Name is required."

            };

        }

        if (!company.entityType) {

            return {

                valid: false,

                message: "Legal Entity Type is required."

            };

        }

        if (!company.industry) {

            return {

                valid: false,

                message: "Industry is required."

            };

        }

        if (!company.natureOfBusiness) {

            return {

                valid: false,

                message: "Nature of Business is required."

            };

        }

        if (!company.yearOfIncorporation) {

            return {

                valid: false,

                message: "Year of Incorporation is required."

            };

        }

        if (!company.workModel) {

            return {

                valid: false,

                message: "Work Model is required."

            };

        }

        return {

            valid: true

        };

    }

}
