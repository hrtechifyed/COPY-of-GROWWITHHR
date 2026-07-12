document.addEventListener("DOMContentLoaded", async () => {

    const company = new CompanyDNA();

    const storage = new CompanyStorage();

    await loadReferenceData();

    attachEmployeeCalculation();

    document
        .getElementById("addLocation")
        .addEventListener("click", addLocationRow);

    document
        .getElementById("organizationProfileForm")
        .addEventListener("submit", saveOrganizationProfile);

    calculateCurrentEmployees();

    async function loadReferenceData() {

        await loadEntityTypes();

        await loadIndustries();

        await loadBusinessNature();

        await loadWorkModels();

        await loadEstablishmentTypes();

        await loadOrganizationStatus();

    }

    async function loadEntityTypes() {

        const response = await fetch("../data/reference/entity-types.json");

        const data = await response.json();

        const select = document.getElementById("entityType");

        data.forEach(group => {

            const optgroup = document.createElement("optgroup");

            optgroup.label = group.category;

            group.items.forEach(item => {

                const option = document.createElement("option");

                option.value = item;

                option.textContent = item;

                optgroup.appendChild(option);

            });

            select.appendChild(optgroup);

        });

    }

    async function loadIndustries() {

        const response = await fetch("../data/reference/industries.json");

        const data = await response.json();

        const select = document.getElementById("industry");

        data.forEach(group => {

            const optgroup = document.createElement("optgroup");

            optgroup.label = group.category;

            group.items.forEach(item => {

                const option = document.createElement("option");

                option.value = item;

                option.textContent = item;

                optgroup.appendChild(option);

            });

            select.appendChild(optgroup);

        });

    }

    async function loadBusinessNature() {

        const response = await fetch("../data/reference/business-nature.json");

        const data = await response.json();

        const select = document.getElementById("natureOfBusiness");

        data.forEach(group => {

            const optgroup = document.createElement("optgroup");

            optgroup.label = group.category;

            group.items.forEach(item => {

                const option = document.createElement("option");

                option.value = item;

                option.textContent = item;

                optgroup.appendChild(option);

            });

            select.appendChild(optgroup);

        });

    }

    async function loadWorkModels() {

        const response = await fetch("../data/reference/work-models.json");

        const data = await response.json();

        const select = document.getElementById("workModel");

        data.forEach(item => {

            const option = document.createElement("option");

            option.value = item;

            option.textContent = item;

            select.appendChild(option);

        });

    }

    async function loadEstablishmentTypes() {

        const response = await fetch("../data/reference/establishment-types.json");

        const data = await response.json();

        const container = document.getElementById("establishmentTypes");

        data.forEach(item => {

            const label = document.createElement("label");

            label.style.display = "block";

            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";

            checkbox.value = item;

            checkbox.name = "establishmentTypes";

            label.appendChild(checkbox);

            label.append(" " + item);

            container.appendChild(label);

        });

    }

    async function loadOrganizationStatus() {

        const response = await fetch("../data/reference/organization-status.json");

        const data = await response.json();

        const container = document.getElementById("organizationStatus");

        data.forEach(group => {

            const title = document.createElement("h4");

            title.textContent = group.category;

            container.appendChild(title);

            group.items.forEach(item => {

                const label = document.createElement("label");

                label.style.display = "block";

                const checkbox = document.createElement("input");

                checkbox.type = "checkbox";

                checkbox.value = item;

                checkbox.name = "organizationStatus";

                label.appendChild(checkbox);

                label.append(" " + item);

                container.appendChild(label);

            });

        });

    }

    function attachEmployeeCalculation() {

        [

            "permanent",

            "contract",

            "interns",

            "apprentices",

            "consultants",

            "gigWorkers"

        ].forEach(id => {

            document

                .getElementById(id)

                .addEventListener("input", calculateCurrentEmployees);

        });

    }

    function calculateCurrentEmployees() {

        const total =

            number("permanent") +

            number("contract") +

            number("interns") +

            number("apprentices") +

            number("consultants") +

            number("gigWorkers");

        document.getElementById("currentEmployees").value = total;

    }

    function number(id) {

        return Number(document.getElementById(id).value || 0);

    }

    function addLocationRow() {

        const container = document.getElementById("locationsContainer");

        const row = document.createElement("div");

        row.className = "location-row";

        row.innerHTML = `

            <select class="country">

                <option value="">Select Country</option>

            </select>

            <select class="state">

                <option value="">Select State</option>

            </select>

            <input
                type="text"
                class="city"
                placeholder="City">

        `;

        container.appendChild(row);

    }

    function selectedValues(name) {

        return [...document.querySelectorAll(`input[name="${name}"]:checked`)]

            .map(item => item.value);

    }

    async function saveOrganizationProfile(event) {

        event.preventDefault();

        company.set({

            companyName: document.getElementById("companyName").value,

            entityType: document.getElementById("entityType").value,

            industry: document.getElementById("industry").value,

            natureOfBusiness: document.getElementById("natureOfBusiness").value,

            yearOfIncorporation: document.getElementById("yearOfIncorporation").value,

            workModel: document.getElementById("workModel").value,

            workforce: {

                permanent: number("permanent"),

                contract: number("contract"),

                interns: number("interns"),

                apprentices: number("apprentices"),

                consultants: number("consultants"),

                gigWorkers: number("gigWorkers")

            },

            growth: {

                projectedEmployees: number("projectedEmployees"),

                projectionPeriod: document.getElementById("projectionPeriod").value

            },

            establishmentTypes: selectedValues("establishmentTypes"),

            organizationStatus: selectedValues("organizationStatus")

        });

        const result = storage.save(company.get());

if (!result.valid) {

    alert(result.message);

    return;

}

alert(result.message);

    }

});
