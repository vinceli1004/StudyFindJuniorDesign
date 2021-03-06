import { studyFields, searchTerms } from "./../constants";

/* --------------------------------- info ---------------------------------
Study Fields:
- BriefTitle
- BriefSummary 
- Condition
- Keyword
- EnrollmentCount
- LocationCity
- LocationCountry 
- MinimumAge
- MaximumAge
- StdAge
- OrgFullName 
- StartDate
- CompletionDate
*/

// gather keywords from constants.js and sort them to display for autocomplete
export const getKeywords = () => {
  const keywords = [...searchTerms];
  keywords.sort();
  return keywords;
};

// gather a subset of studies using user's search terms
export const getResponseFromSearch = async (searchTerms, minimum, maximum) => {
  const expr = encodeURIComponent(searchTerms);
  const fields = studyFields.join("%2C+");
  const baseURL = `https://clinicaltrials.gov/api/query/study_fields?expr=${expr}&fields=${fields}&fmt=json`;
  const data = [];
  let totalStudies = 0;

  // call api in sets of 1000
  for (let i = minimum; i <= maximum; i += 1000) {
    const ranks = `&min_rnk=${i}&max_rnk=${i + 999}`;
    const response = await fetch(baseURL + ranks);
    const json = await response.json();

    // gather the total
    totalStudies = json.StudyFieldsResponse.NStudiesFound;

    // terminate early if range is greater than max
    if (json.StudyFieldsResponse.StudyFields === undefined) break;

    // fix information to match range
    json.StudyFieldsResponse.StudyFields = json.StudyFieldsResponse.StudyFields.filter(
      (study) => study.Rank >= minimum && study.Rank <= maximum
    );
    json.StudyFieldsResponse.NStudiesReturned =
      json.StudyFieldsResponse.StudyFields.length;

    // add to final data set
    data.push(json.StudyFieldsResponse);
  }
  return { minimum, maximum, totalStudies, data };
};

// break down api response into min rank, max rank, number of studies, and actual list of studies
export const getInfoFromResponse = (responses) => {
  let { minimum: minRank, maximum: maxRank, totalStudies, data } = responses;
  let studiesFound = 0;
  let studies = [];

  // update values using list of responses
  data.forEach(({ NStudiesReturned, StudyFields }) => {
    studiesFound += NStudiesReturned;
    studies.push(...StudyFields);
  });

  // reformat
  studies = studies.map((item) => ({
    briefTitle: item.BriefTitle[0],
    briefSummary: item.BriefSummary[0],
    condition: item.Condition,
    keyword: item.Keyword,
    enrollmentCount: item.EnrollmentCount[0],
    locationCity: item.LocationCity[0],
    locationCountry: item.LocationCountry[0],
    minimumAge: item.MinimumAge[0],
    maximumAge: item.MaximumAge[0],
    stdAge: item.StdAge,
    organization: item.OrgFullName[0],
    startDate: item.StartDate[0],
    endDate: item.CompletionDate[0],
  }));

  // hand back to caller
  return { minRank, maxRank, totalStudies, studiesFound, studies };
};

// paginate data
export const paginateStudies = (studies, resultsPerPage) => {
  const splitStudies = [];
  for (let i = 0; i < studies.length; i += resultsPerPage) {
    splitStudies.push(studies.slice(i, i + resultsPerPage));
  }
  return splitStudies;
};
