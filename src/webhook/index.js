import { flatten } from 'lodash';
import path from 'path';
import config from './../../config/main.json';
import filters from './../filters';

module.exports = ({
  parse: (service, pullRequestId, owner, repo, rawOutput) =>
    // Get list of files in a specific pull request
    service.pullRequests.getFiles({ owner, repo, number: pullRequestId })
    .then((resp) => {
      const exts = config.pullRequests.allowedExtensions;
      // const exts = config.pullRequests.disAllowedExtensions;
      const paths = config.pullRequests.excludedPaths;
      const prefix = config.pullRequests.allowedPrefixRegex;
      const files = resp.data.filter((file) => {
        const fileObj = path.parse(file.filename);
        const matchExt = exts.includes(fileObj.ext);
        const matchPrefix = (fileObj.name.match(RegExp(prefix)) || '').length > 0;
        return matchExt || matchPrefix;
      })
      .filter((file) => {
        const len = paths.length;
        return paths.filter(r => !file.filename.match(RegExp(r))).length === len;
      });

      return files;
    })
    .map(file => service.gitdata.getBlob({ owner, repo, sha: file.sha }).then(
      resp => ({ blob: resp.data, meta: file })
    ))
    .then((files) => {
      // Apply filters specific for file types
      const issues = [];

      files.forEach((file) => {
        // Remove sensitive and memory consuming elements.
        delete file.meta.patch;
        delete file.meta.contents_url;

        const issuesDetails = filters.processFile(file.meta, file.blob.content);
        if (issuesDetails.length > 0) {
          issues.push(issuesDetails);
        }
      });

      return flatten(issues);
    })
    .then(issues => require('../render/index.js')({ issues }, rawOutput))
});
