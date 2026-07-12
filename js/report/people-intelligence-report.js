class PeopleIntelligenceReport {

    constructor(company, requirementsResult) {

        this.company = company;
        this.result = requirementsResult;

    }

    generate() {

        return {

            generatedOn: new Date().toISOString(),

            company: {

                companyName: this.company.company.companyName,

                entityType: this.company.company.entityType,

                industry: this.company.company.industry,

                natureOfBusiness: this.company.company.natureOfBusiness,

                workModel: this.company.company.workModel,

                countries: this.company.company.countries,

                states: this.company.company.states,

                cities: this.company.company.cities,

                totalEmployees: this.company.getTotalEmployees(),

                projectedEmployees: this.company.company.growth.projectedEmployees

            },

            summary: {

                mandatory: this.result.mandatory.length,

                recommended: this.result.recommended.length,

                notYetApplicable: this.result.notYetApplicable.length

            },

            mandatory: this.sort(this.result.mandatory),

            recommended: this.sort(this.result.recommended),

            notYetApplicable: this.sort(this.result.notYetApplicable)

        };

    }

    sort(requirements) {

        return [...requirements].sort((a, b) =>

            a.title.localeCompare(b.title)

        );

    }

}
