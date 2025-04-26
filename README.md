# Molecule Descriptor Calculator

The Molecule Descriptor Calculator is a web application that calculates molecular descriptors from SMILES (Simplified Molecular Input Line Entry System) strings provided in a CSV file. Built with Next.js, React, and Tailwind CSS, this tool supports descriptor calculation using libraries like RDKit, PaDEL, and Mordred, with options for filtering and exporting results.

## Installation

### Clone the Repository:

```bash
git clone git@github.com:shifath-acog/Molecule_Descriptor_Calculator.git
cd molecule-descriptor-calculator
```

### Install Dependencies:

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### Run the Development Server:

Using npm:

```bash
npm run dev
```

Or using yarn:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Upload a CSV File:

- Click the **"Click to upload CSV"** button to upload a CSV file containing SMILES strings.
- The CSV should have a column named 'SMILES' with SMILES data 

### Select Options:

- **Descriptor Type**: Choose the type of descriptors (currently supports "1D/2D").
- **Calculation Method**: Select the method (RDKit, PaDEL, or Mordred).
- **Filter Option**: Apply a filter (e.g., "None", "Molecular fragment").

### Calculate Descriptors:

- Click the **"Calculate Descriptors"** button to process the file.

### View Results:

- Results are displayed in a table with columns like SMILES, Structure, and calculated descriptors (e.g., `MaxAbsEStateIndex`).
- Sort columns by clicking the headers, filter rows using the input fields, and expand structure images by clicking them.

### Export Results:

- Click the **"Export as CSV"** button to download the results as a CSV file.
