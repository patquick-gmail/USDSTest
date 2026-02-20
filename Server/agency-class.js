// ===== AgencyChangeCount Class =====

class AgencyChangeCount {
  constructor() {
    this.total_count = 0;
    this.description = '';
  }

  // Convert to plain object for JSON serialization
  toJSON() {
    return {
      total_count: this.total_count,
      description: this.description
    };
  }

  // Create from JSON object
  static fromJSON(data) {
    const count = new AgencyChangeCount();
    count.total_count = data.total_count || 0;
    count.description = data.description || '';
    return count;
  }

}

// ===== AgencyChangeCounts Class =====

class AgencyChangeCounts {
  constructor() {
    this.meta = new AgencyChangeCount();
  }

  // Convert to plain object for JSON serialization
  toJSON() {
    console.log('Converting agency change counts to JSON');

    return {
      meta: this.meta.toJSON ? this.meta.toJSON() : this.meta      
    };
  }

  // Create from JSON object
  static fromJSON(data) {
    const changeCounts = new AgencyChangeCounts();
    if (data.meta) {
      changeCounts.meta = AgencyChangeCount.fromJSON(data.meta);
    }
    return changeCounts;
  }

}


// ===== AgencyChangeCountsByDate Class =====

class AgencyChangeCountsByDate {
  constructor() {
    this.count = 0;
    this.date = '';
    this.dates = [];
  }

  // Convert to plain object for JSON serialization
  toJSON() {
    return {
      count: this.count,
      date: this.date,
      dates: this.dates ? this.dates.toJSON ? this.dates.toJSON() : this.dates : undefined
    };
  }

  // Create from JSON object
  static fromJSON(data) {
    const countByDate = new AgencyChangeCountsByDate();
    countByDate.count = data.count || 0;
    countByDate.date = data.date || '';
    return countByDate;
  }

}

// ===== AgencyChangeCountsByDates Class =====

class AgencyChangeCountsByDates {
  constructor() {
    this.dates = new AgencyChangeCountsByDate();
  }

  // Convert to plain object for JSON serialization
  toJSON() {
    console.log('Converting agency change counts by date to JSON');

    return {
      dates: this.dates.toJSON ? this.dates.toJSON() : this.dates      
    };
  }

  // Create from JSON object
  static fromJSON(data) {
    const changeCountsByDates = new AgencyChangeCountsByDates();
    if (data.dates) {
      changeCounts.dates = AgencyChangeCountsByDate.fromJSON(data.dates);
    }
    return changeCountsByDates;
  }

}

// ===== AgencyChangeCountsByTitleClass =====

class AgencyChangeCountsByTitle {
  constructor() {
    this.count = 0;
    this.title = '';
    this.titles = [];
  }

  // Convert to plain object for JSON serialization
  toJSON() {
    return {
      count: this.count,
      title: this.title,
      titles: this.titles ? this.titles.toJSON ? this.titles.toJSON() : this.titles : undefined
    };
  }

  // Create from JSON object
  static fromJSON(data) {
    const countByTitle = new AgencyChangeCountsByTitle();
    countByDate.count = data.count || 0;
    countByDate.title = data.title || '';
    return countByTitle;
  }

}

// ===== AgencyChangeCountsByTitles Class =====

class AgencyChangeCountsByTitles {
  constructor() {
    this.titles = new AgencyChangeCountsByTitle();
  }

  // Convert to plain object for JSON serialization
  toJSON() {
    console.log('Converting agency change counts by date to JSON');

    return {
      titles: this.titles.toJSON ? this.titles.toJSON() : this.titles
    };
  }

  // Create from JSON object
  static fromJSON(data) {
    const changeCountsByTitles = new AgencyChangeCountsByTitles();
    if (data.titles) {
      changeCounts.titles = AgencyChangeCountByTitle.fromJSON(data.titles);
    }
    return changeCountsByTitles;
  }

}

// ===== CFR Reference Class =====

class cfr_reference {
  constructor() {
    this.title = 0;
    this.chapter = '';
  }

  // Helper method to get formatted reference string
  toString() {
    if (this.chapter) {
      return `${this.title} CFR ${this.chapter}`;
    }
    return `Title ${this.title}`;
  }

  // Convert to plain object for JSON serialization
  toJSON() {
    return {
      title: this.title,
      chapter: this.chapter
    };
  }

  // Create cfr_reference from JSON object
  static fromJSON(data) {
    const ref = new cfr_reference();
    ref.title = data.title || 0;
    ref.chapter = data.chapter || '';
    return ref;
  }

  // Check if reference is valid
  isValid() {
    return this.title > 0;
  }

  // Check if two references are equal
  equals(other) {
    if (!other) return false;
    return this.title === other.title && this.chapter === other.chapter;
  }
}

// ===== Agency Class =====

class Agency {
  constructor() {
    this.name = '';
    this.short_name = '';
    this.display_name = '';
    this.sortable_name = '';
    this.slug = '';
    this.children = [];
    this.cfr_references = [];
    this.word_count = '';
    this.total_count = '';
    this.description = '';
	  this.agencyChangeCounts = new AgencyChangeCounts();
    this.agencyChangeCountsByDate = new AgencyChangeCountsByDate();
    this.agencyChangeCountsByTitle = new AgencyChangeCountsByTitle();
  }

  // Helper method to add a child agency
  addChild(agency) {
    this.children.push(agency);
    return this;
  }

  // Helper method to add CFR reference
  addCFRReference(title, chapter = null, subtitle = null) {
    const ref = new CFRReference(title, chapter, subtitle);
    this.cfr_references.push(ref);
    return this;
  }

  // Helper method to get children count
  getChildrenCount() {
    return this.children.length;
  }

  // Helper method to get CFR references count
  getCFRReferencesCount() {
    return this.cfr_references.length;
  }

  // Convert to plain object
  toJSON() {

    console.log(`Converting agency ${this.name} to JSON`);

    return {
      name: this.name,
      short_name: this.short_name,
      display_name: this.display_name,
      sortable_name: this.sortable_name,
      slug: this.slug,
      children: this.children.map(child => child.toJSON ? child.toJSON() : child),
      cfr_references: this.cfr_references.map(ref => ref.toJSON ? ref.toJSON() : ref),
      word_count: this.word_count,
      total_count: this.total_count,
      description: this.description,
	    agencyChangeCounts: this.agencyChangeCounts.toJSON ? this.agencyChangeCounts.toJSON() : this.agencyChangeCounts,
      agencyChangeCountsByDate: this.agencyChangeCountsByDate.toJSON ? this.agencyChangeCountsByDate.toJSON() : this.agencyChangeCountsByDate,
      agencyChangeCountsByTitle: this.agencyChangeCountsByTitle.toJSON ? this.agencyChangeCountsByTitle.toJSON() : this.agencyChangeCountsByTitle
    };
  }

  // Create Agency from JSON object
  static fromJSON(data) {
    const agency = new Agency();
    
    agency.name = data.name || '';
    agency.short_name = data.short_name || '';
    agency.display_name = data.display_name || '';
    agency.sortable_name = data.sortable_name || '';
    agency.slug = data.slug || '';
    agency.word_count = data.word_count || '';
    agency.total_count = data.total_count || '';
    agency.description = data.description || '';

    // Convert children
    if (data.children && Array.isArray(data.children)) {
      agency.children = data.children.map(childData => Agency.fromJSON(childData));
    }

    // Convert CFR references
    if (data.cfr_references && Array.isArray(data.cfr_references)) {
      agency.cfr_references = data.cfr_references.map(ref => 
        new cfr_reference(ref.title, ref.chapter, ref.subtitle)
      );
    }

    // Convert change counts
	if (data.agencyChangeCounts) {
      agency.agencyChangeCounts = Object.assign(new AgencyChangeCounts(), data.agencyChangeCounts);
    }

    if (data.agencyChangeCountsByDate) {
      agency.agencyChangeCountsByDate = Object.assign(new AgencyChangeCountsByDate(), data.agencyChangeCountsByDate);
    }

    if (data.agencyChangeCountsByTitle) {
      agency.agencyChangeCountsByTitle = Object.assign(new AgencyChangeCountsByTitle(), data.agencyChangeCountsByTitle);
    }

    return agency;
  }

	/**
	 * Convert JSON string to JavaScript object
	 * @param {string} jsonString - The JSON string to parse
	 * @returns {any} - Parsed JavaScript object
	 */
	static jsonToObject(jsonString) {
	  try {
		const obj = JSON.parse(jsonString);
		return obj;
	  } catch (error) {
		console.error('Failed to parse JSON:', error.message);
		throw error;
	  }
	}

	/**
	 * Check if string is valid JSON
	 * @param {string} str - String to validate
	 * @returns {boolean}
	 */
	static isValidJson(str) {
	  try {
		JSON.parse(str);
		return true;
	  } catch {
		return false;
	  }
	}

}


// ===== Agencies Class (Collection) =====

class Agencies {
  constructor() {
    this.agencies = [];
  }

  // Add an agency to the collection
  addAgency(agency) {
    if (!(agency instanceof Agency)) {
      agency = Agency.fromJSON(agency);
    }
    this.agencies.push(agency);
    return this;
  }

  // Get all agencies
  getAgencies() {
    return this.agencies;
  }

  // Get agency by index
  getAgencyAt(index) {
    return this.agencies[index] || null;
  }

  // Get agency by slug
  getAgencyBySlug(slug) {
    return this.agencies.find(agency => agency.slug === slug) || null;
  }

  // Get agency by name
  getAgencyByName(name) {
    return this.agencies.find(agency => 
      agency.name.toLowerCase() === name.toLowerCase()
    ) || null;
  }

  // Get agency by short name
  getAgencyByShortName(shortName) {
    return this.agencies.find(agency => 
      agency.short_name.toLowerCase() === shortName.toLowerCase()
    ) || null;
  }

  // Get count of agencies
  count() {
    return this.agencies.length;
  }

  // Remove agency by index
  removeAgencyAt(index) {
    if (index >= 0 && index < this.agencies.length) {
      return this.agencies.splice(index, 1)[0];
    }
    return null;
  }

  // Clear all agencies
  clear() {
    this.agencies = [];
    return this;
  }

  // Load agencies from array
  loadAgencies(agenciesArray) {
    this.agencies = agenciesArray.map(agencyData => {
      if (agencyData instanceof Agency) {
        return agencyData;
      }
      return Agency.fromJSON(agencyData);
    });
    return this;
  }

  // Convert to plain object
  toJSON() {
    return {
      agencies: this.agencies.map(agency => agency.toJSON())
    };
  }

  // Create Agencies from JSON object
  static fromJSON(data) {
    const agencies = new Agencies();
    
    if (data.agencies && Array.isArray(data.agencies)) {
      agencies.loadAgencies(data.agencies);
    } else if (data.agencyData && data.agencyData.agencies) {
      // Handle wrapped format like { agencyData: { agencies: [...] } }
      agencies.loadAgencies(data.agencyData.agencies);
    }
    
    return agencies;
  }

  // Get total count of all children across all agencies
  getTotalChildrenCount() {
    return this.agencies.reduce((total, agency) => 
      total + agency.getChildrenCount(), 0
    );
  }

  // Get total count of all CFR references across all agencies
  getTotalCFRReferencesCount() {
    return this.agencies.reduce((total, agency) => 
      total + agency.getCFRReferencesCount(), 0
    );
  }

  // Filter agencies by criteria
  filter(predicate) {
    return this.agencies.filter(predicate);
  }

  // Find first agency matching criteria
  find(predicate) {
    return this.agencies.find(predicate);
  }

  // Map over agencies
  map(callback) {
    return this.agencies.map(callback);
  }

  // Iterate over agencies
  forEach(callback) {
    this.agencies.forEach(callback);
  }

  // Sort agencies by field
  sortBy(field, ascending = true) {
    this.agencies.sort((a, b) => {
      const aVal = a[field] || '';
      const bVal = b[field] || '';
      const comparison = aVal.toString().localeCompare(bVal.toString());
      return ascending ? comparison : -comparison;
    });
    return this;
  }
}

// For CommonJS (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Agencies,
    Agency,
    cfr_reference,
	AgencyChangeCounts,
	AgencyChangeCount,
    AgencyChangeCountsByDate,
	AgencyChangeCountsByDate,
    AgencyChangeCountsByTitle,
	AgencyChangeCountsByTitle
  };
}

//export default Agencies;
//export default Agency;
//export default CFRReference;
//export default AgencyChangeCount;