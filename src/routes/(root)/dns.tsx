import { createSignal } from 'solid-js'

type DNSRecord = {
    type: number;
    TTL: number;
    data: string;
}

type DNSQuestion = {
    name: string;
    type: number;
}

type DNSResponse = {
    id: number;
    timestamp: number;
    status: number;
    question: DNSQuestion;
    results: DNSRecord[];
}

const DNS_STATUS = {
    0: { code: 'NoError', message: 'No Error' },
    1: { code: 'FormErr', message: 'Format Error' },
    2: { code: 'ServFail', message: 'Server Failure' },
    3: { code: 'NXDomain', message: 'Non-Existent Domain' },
    4: { code: 'NotImp', message: 'Not Implemented' },
    5: { code: 'Refused', message: 'Query Refused' }
} as const

const DNS_RECORD_TYPES = {
    1: { code: 'A', description: 'a host address' },
    2: { code: 'NS', description: 'an authoritative name server' },
    5: { code: 'CNAME', description: 'the canonical name for an alias' },
    6: { code: 'SOA', description: 'marks the start of a zone of authority' },
    12: { code: 'PTR', description: 'a domain name pointer' },
    15: { code: 'MX', description: 'mail exchange' },
    16: { code: 'TXT', description: 'text strings' },
    24: { code: 'SIG', description: 'for security signature' },
    25: { code: 'KEY', description: 'for security key' },
    28: { code: 'AAAA', description: 'IP6 Address' },
    33: { code: 'SRV', description: 'Server Selection' },
    43: { code: 'DS', description: 'Delegation Signer' },
    46: { code: 'RRSIG', description: 'RRSIG' },
    47: { code: 'NSEC', description: 'NSEC' },
    48: { code: 'DNSKEY', description: 'DNSKEY' },
    52: { code: 'TLSA', description: 'TLSA' },
    53: { code: 'SMIMEA', description: 'S/MIME' },
    57: { code: 'RKEY', description: 'RKEY' }
} as const

const formatTTL = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
    return `${Math.floor(seconds / 86400)}d`
}

const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
}

export default function Dns() {
    const [domain, setDomain] = createSignal('')
    const [recordType, setRecordType] = createSignal('')
    const [history, setHistory] = createSignal<DNSResponse[]>([])
    const [loading, setLoading] = createSignal(false)
    const [error, setError] = createSignal('')

    const handleSubmit = async (e: Event) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const queryType = recordType() || ''
            const params = new URLSearchParams({
                name: domain(),
                ...(queryType && { type: queryType })
            })

            const response = await fetch(`https://cloudflare-dns.com/dns-query?${params}`, {
                headers: {
                    'Accept': 'application/dns-json'
                }
            })

            if (!response.ok) {
                throw new Error('DNS query failed')
            }

            const data = await response.json()
            
            if (data.Status !== 0) {
                const statusInfo = DNS_STATUS[data.Status as keyof typeof DNS_STATUS]
                throw new Error(statusInfo?.message || 'Unknown DNS error')
            }

            const newResponse: DNSResponse = {
                id: Date.now(),
                timestamp: Date.now(),
                status: data.Status,
                question: data.Question[0],
                results: data.Answer || []
            }

            setHistory(prev => [newResponse, ...prev].slice(0, 10))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch DNS records')
        } finally {
            setLoading(false)
        }
    }

    const getRecordTypeInfo = (type: number) => {
        const info = DNS_RECORD_TYPES[type as keyof typeof DNS_RECORD_TYPES]
        return info || { code: `TYPE${type}`, description: 'Unknown record type' }
    }

    return (
        <div class="dns-page">
            <a href="/" class="back-arrow">←</a>
            <div class="dns-container">
                <h1>dns</h1>
                <form onSubmit={handleSubmit} class="dns-form">
                    <div class="form-group">
                        <input
                            type="text"
                            value={domain()}
                            onInput={(e) => setDomain(e.currentTarget.value)}
                            placeholder="domain name"
                            required
                            class="dns-input"
                        />
                        <select
                            value={recordType()}
                            onChange={(e) => setRecordType(e.currentTarget.value)}
                            class="dns-select"
                        >
                            <option value="">type</option>
                            <option value="AAAA">AAAA</option>
                            <option value="A">A</option>
                            <option value="CNAME">CNAME</option>
                            <option value="MX">MX</option>
                            <option value="TXT">TXT</option>
                        </select>
                        <button type="submit" class="dns-button" disabled={loading()}>
                            {loading() ? 'Querying...' : 'lookup'}
                        </button>
                    </div>
                </form>

                {error() && (
                    <div class="dns-status dns-status-error">
                        <span class="dns-status-message">{error()}</span>
                    </div>
                )}

                <div class="dns-history">
                    {history().map((response) => (
                        <div class="dns-result-group">
                            <div class="dns-question">
                                <span class="question-type" title={getRecordTypeInfo(response.question.type).description}>
                                    {getRecordTypeInfo(response.question.type).code}
                                </span>
                                <span class="question-label">request</span>
                                <span class="question-name">{response.question.name}</span>
                                <span class="question-time">{formatTime(response.timestamp)}</span>
                            </div>
                            {response.results.length > 0 && (
                                <div class="results-grid">
                                    {response.results.map((record) => {
                                        const typeInfo = getRecordTypeInfo(record.type)
                                        return (
                                            <div class="result-item">
                                                <div class="result-type" title={typeInfo.description}>
                                                    {typeInfo.code}
                                                </div>
                                                <div class="result-ttl" title="Time To Live">
                                                    {formatTTL(record.TTL)}
                                                </div>
                                                <div class="result-data">{record.data}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}