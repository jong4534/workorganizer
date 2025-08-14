<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="onBackdropClick">
    <div class="bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4" @click.stop>
      <div class="p-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="flex-shrink-0">
            <svg 
              class="w-6 h-6"
              :class="iconColor"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                :d="iconPath"
              ></path>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-medium text-foreground">{{ title }}</h3>
            <p class="text-sm text-muted-foreground mt-1">{{ message }}</p>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="$emit('cancel')"
            class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-input rounded-md hover:bg-muted transition-colors"
          >
            {{ cancelText }}
          </button>
          <button
            @click="$emit('confirm')"
            :class="confirmButtonClass"
            class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    title: {
      type: String,
      default: '확인'
    },
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: '확인'
    },
    cancelText: {
      type: String,
      default: '취소'
    },
    type: {
      type: String,
      default: 'warning', // warning, danger, info
      validator: (value) => ['warning', 'danger', 'info'].includes(value)
    }
  },
  emits: ['confirm', 'cancel'],
  computed: {
    iconColor() {
      switch (this.type) {
        case 'danger':
          return 'text-destructive'
        case 'info':
          return 'text-blue-500'
        default:
          return 'text-yellow-500'
      }
    },
    iconPath() {
      switch (this.type) {
        case 'danger':
          return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
        case 'info':
          return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        default:
          return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
      }
    },
    confirmButtonClass() {
      switch (this.type) {
        case 'danger':
          return 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
        case 'info':
          return 'bg-blue-500 text-white hover:bg-blue-600'
        default:
          return 'bg-yellow-500 text-white hover:bg-yellow-600'
      }
    }
  },
  setup(props, { emit }) {
    const onBackdropClick = (event) => {
      if (event.target === event.currentTarget) {
        emit('cancel')
      }
    }

    return {
      onBackdropClick
    }
  }
}
</script>




