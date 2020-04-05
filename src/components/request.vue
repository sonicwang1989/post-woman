<template>
  <div>
    <!-- <div class="title">未命名请求</div> -->
    <div class="body">
      <el-row :gutter="20">
        <el-col :span="18">
          <el-input v-model="requestUrl" placeholder="请求地址" class="input-with-select">
            <el-select v-model="requestMethod" slot="prepend" placeholder="请选择">
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
              <el-option label="OPTIONS" value="OPTIONS"></el-option>
              <el-option label="HEAD" value="HEAD"></el-option>
            </el-select>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="success" icon="el-icon-s-promotion" @click="sendRequest">发送</el-button>
        </el-col>
      </el-row>
      <div class="req-rep">
        <el-collapse v-model="panel">
          <el-collapse-item title="Request" name="request">
            <el-tabs v-model="requestPanel">
              <el-tab-pane label="Headers" name="headers">
                <el-table :data="requestHeaders" size="mini">
                  <el-table-column type="selection" width="60" align="center"></el-table-column>
                  <el-table-column label="键">
                    <template slot-scope="{ row }">
                      <el-select
                        v-model="row.key"
                        filterable
                        allow-create
                        size="mini"
                        @change="headerChanged(row)"
                      >
                        <el-option
                          v-for="(item,index) in headerOptions"
                          :key="index"
                          :label="item.key"
                          :value="item.key"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="值">
                    <template slot-scope="{ row }">
                      <el-select
                        v-model="row.value"
                        filterable
                        allow-create
                        default-first-option
                        size="mini"
                      >
                        <el-option
                          v-for="(item,index) in row.options"
                          :key="index"
                          :label="item"
                          :value="item"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="Params" name="params">
                <el-table :data="requestParams" size="mini">
                  <el-table-column type="selection" width="60" align="center"></el-table-column>
                  <el-table-column label="键">
                    <template slot-scope="{ row }" width="300">
                      <el-input v-model="row.key" size="mini"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="值">
                    <template slot-scope="{ row }">
                      <el-input v-model="row.value" size="mini"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="Body" name="body">
                <el-radio-group v-model="requestDataType" size="mini">
                  <el-radio-button label="none"></el-radio-button>
                  <el-radio-button label="form-data"></el-radio-button>
                  <el-radio-button label="x-www-form-urlencoded"></el-radio-button>
                  <el-radio-button label="raw"></el-radio-button>
                  <el-radio-button label="binary"></el-radio-button>
                </el-radio-group>
                <div class="req-data">
                  <template
                    v-if="requestDataType=='form-data'||requestDataType=='x-www-form-urlencoded'"
                  >
                    <el-table :data="requestData" size="mini">
                      <el-table-column type="selection" width="60" align="center"></el-table-column>
                      <el-table-column label="键">
                        <template slot-scope="{ row }" width="300">
                          <el-input v-model="row.key" size="mini"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column label="值">
                        <template slot-scope="{ row }">
                          <el-input v-model="row.value" size="mini"></el-input>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                  <template v-else-if="requestDataType=='raw'">
                    <el-input v-model="requestData" type="textarea" size="mini" :rows="10"></el-input>
                  </template>
                  <template v-else-if="requestDataType=='binary'">
                    <el-upload ref="upload" :action="uploadUrl" :auto-upload="false">
                      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                  </template>
                </div>
              </el-tab-pane>
              <el-tab-pane label="Settings" name="settings"></el-tab-pane>
            </el-tabs>
          </el-collapse-item>
          <el-collapse-item title="Response" name="response">
            <el-tabs v-model="responsePanel">
              <el-tab-pane label="Headers" name="headers">
                <el-table :data="responseHeaders" size="mini">
                  <el-table-column prop="key" label="键" width="300"></el-table-column>
                  <el-table-column prop="value" label="值"></el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="Body" name="body"></el-tab-pane>
              <el-tab-pane label="Cookie" name="cookie"></el-tab-pane>
            </el-tabs>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { headers } from "../data/http-headers";
export default {
  name: "Request",
  data() {
    return {
      requestUrl: "",
      requestMethod: "GET",
      requestHeaders: [{}, {}, {}],
      requestParams: [{}, {}, {}],
      requestPanel: "headers",
      requestData: null,
      requestDataType: "none",
      responsePanel: "headers",
      responseHeaders: [],
      headerOptions: headers,
      panel: ["request", "response"],
      uploadUrl: ""
    };
  },
  methods: {
    headerChanged(row) {
      let options = [];
      if (row.key) {
        let item = headers.find(t => t.key == row.key);
        if (item) options = item.options;
      }
      this.$set(row, "options", options);
      if (options.length > 0) {
        this.$set(row, "value", options[0]);
      }
    },
    createRequestHeaders() {
      this.requestHeaders = [];
      headers.forEach(header => {
        if (header.suggest) {
          let data = Object.assign({}, header);
          if (!data.value && data.options && data.options.length > 0) {
            data.value = data.options[0];
          }
          this.requestHeaders.push(data);
        }
      });
    },
    createRequest() {
      var config = {
        url: this.requestUrl,
        method: this.requestMethod,
        params: {},
        headers: {},
        data: {}
      };
      if (this.requestHeaders) {
        this.requestHeaders.forEach(item => {
          if (item.key) config.headers[item.key] = item.value;
        });
      }
      if (this.requestParams) {
        this.requestParams.forEach(item => {
          if (item.key) config.params[item.key] = item.value;
        });
      }
      if (this.requestData) {
        if (
          this.requestDataType == "form-data" ||
          this.requestDataType == "x-www-form-urlencoded"
        ) {
          this.requestData.forEach(item => {
            if (item.key) config.data[item.key] = item.value;
          });
        } else if (this.requestDataType == "raw") {
          config.data = this.requestData;
        }
      }
      return config;
    },
    sendRequest() {
      let config = this.createRequest();
      axios.request(config).then(data => {
        console.log(data);

        this.responseHeaders = [];
        Object.keys(data.headers).forEach(key => {
          this.responseHeaders.push({ key, value: data.headers[key] });
        });
      });
    }
  },
  created() {
    this.createRequestHeaders();
  }
};
</script>