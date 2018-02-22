<template>
  <div>
    <b-input-group size="sm">
      <b-input-group-prepend is-text>
        <fa :icon="['far', 'check-circle']" fixed-width v-show="isConnected" class="pr-1"/>
        <fa :icon="['far', 'times-circle']" fixed-width v-show="!isConnected" class="pr-1"/>
        {{ isConnected ? 'Connected' : 'Disconnected' }}
      </b-input-group-prepend>
      <b-form-input type="text" aria-label="Connection URL" v-model="connectionUrl"
        :readonly="!isUrlEditable">
      </b-form-input>
      <b-input-group-append v-if="isUrlEditable">
        <b-button size="sm"><fa icon="sync" fixed-width @click="changeConnectionUrl"/></b-button>
      </b-input-group-append>
    </b-input-group>
  </div>
</template>

<script lang="ts" src="./connection-status.ts"></script>
