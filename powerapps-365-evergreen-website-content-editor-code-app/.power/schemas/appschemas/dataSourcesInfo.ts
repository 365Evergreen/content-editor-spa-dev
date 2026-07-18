/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * This file is auto-generated. Do not modify it manually.
 * Changes to this file may be overwritten.
 */

export const dataSourcesInfo = {
  "dev365_e365blogposts": {
    "tableId": "",
    "version": "",
    "primaryKey": "dev365_e365blogpostid",
    "dataSourceType": "Dataverse",
    "apis": {}
  },
  "blog posts": {
    "tableId": "c59d8232-81b1-4738-869d-e8eb64def9d4",
    "version": "",
    "primaryKey": "ID",
    "dataSourceType": "Connector",
    "apis": {
      "Getswa_PostStatus": {
        "path": "/{connectionId}/datasets/{dataset}/tables/c59d823281b14738869de8eb64def9d4/entities/swa_PostStatus",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "search",
            "in": "query",
            "required": false,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          }
        }
      },
      "Getswa_PostCategory": {
        "path": "/{connectionId}/datasets/{dataset}/tables/c59d823281b14738869de8eb64def9d4/entities/swa_PostCategory",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "search",
            "in": "query",
            "required": false,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          }
        }
      },
      "GetAuthor": {
        "path": "/{connectionId}/datasets/{dataset}/tables/c59d823281b14738869de8eb64def9d4/entities/Author",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "search",
            "in": "query",
            "required": false,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          }
        }
      },
      "GetEditor": {
        "path": "/{connectionId}/datasets/{dataset}/tables/c59d823281b14738869de8eb64def9d4/entities/Editor",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "search",
            "in": "query",
            "required": false,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          }
        }
      },
      "Get4651e8f238c94ad08def41f743f76f30": {
        "path": "/{connectionId}/datasets/{dataset}/tables/c59d823281b14738869de8eb64def9d4/entities/4651e8f238c94ad08def41f743f76f30",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "search",
            "in": "query",
            "required": false,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          }
        }
      }
    }
  }
};
