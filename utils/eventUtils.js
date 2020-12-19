class EventBus = {
	constructor(max = 10, repeatType = true, repeatEvent = false) {
		this._event = this._event || new Map()// 以键值对存储事件
		this._maxListener = this._maxListener || max// 监听上限
		this._repeatType = this._repeatType || repeatType// 允许给同一事件设多个监听
		this._repeatEvent = this._repeatEvent || repeatEvent
	}
}
EventBus.prototype.emit = function(type, ...args) {
	const handler = this._event.get(type)
	if (handler) {
		handler.forEach((hl) => {
			if (args.length) {
				hl.apply(this, args)
			} else {
				hl.call(this)
			}
		})
	}
	return true//是否需要？
}
EventBus.prototype.addListener = function(type, fn) {
	const handler = this._event.get(type)
	if (!handler) {
		this._event.set(type, [fn])
	} else if (this._repeatType) {
		if (handler.some(e => {
			return e === fn
		})) {
			if(this._repeatEvent) {
				handler.push(fn)
			}
		} else {
			handler.push(fn)
		}
	} else {
		this._event.set(type, [fn])
	}
}
EventBus.prototype.removeListener = function(type, fn) {
	const handler = this._event.get(type)
	if (handler) {
		for(let i=0;i<handler.length;i++) {
			if (handler[i] === fn) {
				handler.splice(i, 1)
				i--
			}
		}
	}
}