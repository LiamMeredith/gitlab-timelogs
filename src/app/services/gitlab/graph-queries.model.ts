export const timelogsQuery: string = `
{
  timelogs({{params}}) {
    nodes {
      user {
        username
      }
      spentAt
      note {
        body
      }
      mergeRequest {
        title
        descriptionHtml
        webUrl
        project {
          name
        }
      }
      issue {
        title
        projectId
        webPath
        webUrl
        type
        description
        descriptionHtml
      }
      timeSpent
    }
  }
}
`
export function buildTimelogQuery(params = {}) {
  const builtParams = Object.keys(params).map(key => key + `: "${params[key]}"`).join();
  return timelogsQuery.replace('{{params}}', builtParams);
}
