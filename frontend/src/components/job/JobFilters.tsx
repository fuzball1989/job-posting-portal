import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface JobCategory {
  id: string;
  name: string;
  slug: string;
  jobCount: number;
}

interface JobFiltersProps {
  values: {
    search?: string;
    categoryId?: string;
    location?: string;
    remoteType?: string[];
    employmentType?: string[];
    experienceLevel?: string[];
    salaryMin?: number;
    salaryMax?: number;
  };
  onChange: (filters: any) => void;
  categories: JobCategory[];
}

const JobFilters: React.FC<JobFiltersProps> = ({ values, onChange, categories }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    location: true,
    remoteType: true,
    employmentType: true,
    experienceLevel: true,
    salary: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const handleLocationChange = (location: string) => {
    onChange({ location: location || undefined });
  };

  const handleMultiSelectChange = (field: string, value: string, checked: boolean) => {
    const currentValues = values[field as keyof typeof values] as string[] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    onChange({ [field]: newValues.length > 0 ? newValues : undefined });
  };

  const handleSalaryChange = (field: 'salaryMin' | 'salaryMax', value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    onChange({ [field]: numValue });
  };

  const FilterSection: React.FC<{
    title: string;
    sectionKey: string;
    children: React.ReactNode;
  }> = ({ title, sectionKey, children }) => {
    const isExpanded = expandedSections[sectionKey as keyof typeof expandedSections];
    
    return (
      <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 hover:text-gray-700"
        >
          <span>{title}</span>
          {isExpanded ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </button>
        {isExpanded && (
          <div className="mt-3 space-y-2">
            {children}
          </div>
        )}
      </div>
    );
  };

  const CheckboxOption: React.FC<{
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    count?: number;
  }> = ({ id, label, checked, onChange, count }) => (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-sm text-gray-700 flex-1">{label}</span>
      {typeof count === 'number' && (
        <span className="text-xs text-gray-400">({count})</span>
      )}
    </label>
  );

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      {categories.length > 0 && (
        <FilterSection title="Category" sectionKey="category">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <CheckboxOption
                key={category.id}
                id={`category-${category.id}`}
                label={category.name}
                checked={values.categoryId === category.id}
                onChange={(checked) => {
                  onChange({ categoryId: checked ? category.id : undefined });
                }}
                count={category.jobCount}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Location Filter */}
      <FilterSection title="Location" sectionKey="location">
        <input
          type="text"
          placeholder="Enter city or region..."
          value={values.location || ''}
          onChange={(e) => handleLocationChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </FilterSection>

      {/* Remote Type Filter */}
      <FilterSection title="Work Type" sectionKey="remoteType">
        {[
          { value: 'office', label: 'On-site' },
          { value: 'remote', label: 'Remote' },
          { value: 'hybrid', label: 'Hybrid' },
        ].map((option) => (
          <CheckboxOption
            key={option.value}
            id={`remote-${option.value}`}
            label={option.label}
            checked={values.remoteType?.includes(option.value) || false}
            onChange={(checked) => 
              handleMultiSelectChange('remoteType', option.value, checked)
            }
          />
        ))}
      </FilterSection>

      {/* Employment Type Filter */}
      <FilterSection title="Employment Type" sectionKey="employmentType">
        {[
          { value: 'full_time', label: 'Full-time' },
          { value: 'part_time', label: 'Part-time' },
          { value: 'contract', label: 'Contract' },
          { value: 'internship', label: 'Internship' },
        ].map((option) => (
          <CheckboxOption
            key={option.value}
            id={`employment-${option.value}`}
            label={option.label}
            checked={values.employmentType?.includes(option.value) || false}
            onChange={(checked) => 
              handleMultiSelectChange('employmentType', option.value, checked)
            }
          />
        ))}
      </FilterSection>

      {/* Experience Level Filter */}
      <FilterSection title="Experience Level" sectionKey="experienceLevel">
        {[
          { value: 'entry', label: 'Entry Level' },
          { value: 'mid', label: 'Mid Level' },
          { value: 'senior', label: 'Senior Level' },
          { value: 'lead', label: 'Lead' },
          { value: 'executive', label: 'Executive' },
        ].map((option) => (
          <CheckboxOption
            key={option.value}
            id={`experience-${option.value}`}
            label={option.label}
            checked={values.experienceLevel?.includes(option.value) || false}
            onChange={(checked) => 
              handleMultiSelectChange('experienceLevel', option.value, checked)
            }
          />
        ))}
      </FilterSection>

      {/* Salary Filter */}
      <FilterSection title="Salary Range (USD)" sectionKey="salary">
        <div className="space-y-3">
          <div>
            <label htmlFor="salary-min" className="block text-xs font-medium text-gray-700 mb-1">
              Minimum
            </label>
            <input
              type="number"
              id="salary-min"
              placeholder="0"
              value={values.salaryMin || ''}
              onChange={(e) => handleSalaryChange('salaryMin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              step="1000"
            />
          </div>
          <div>
            <label htmlFor="salary-max" className="block text-xs font-medium text-gray-700 mb-1">
              Maximum
            </label>
            <input
              type="number"
              id="salary-max"
              placeholder="No limit"
              value={values.salaryMax || ''}
              onChange={(e) => handleSalaryChange('salaryMax', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              step="1000"
            />
          </div>
          <div className="flex flex-wrap gap-1 text-xs">
            {[
              { min: 50000, max: 75000, label: '50-75K' },
              { min: 75000, max: 100000, label: '75-100K' },
              { min: 100000, max: 150000, label: '100-150K' },
              { min: 150000, max: undefined, label: '150K+' },
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => {
                  onChange({
                    salaryMin: range.min,
                    salaryMax: range.max,
                  });
                }}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>
    </div>
  );
};

export default JobFilters;