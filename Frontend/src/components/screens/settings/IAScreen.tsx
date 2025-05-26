import { useRef, useEffect, useState, useMemo } from 'react'
import { DynamicFormHandles } from '@/components/molecules/Dynamic-form'
import IATemplate from '@/components/templates/settings/IATemplate'

import useUpdateApiKey from '@/hooks/ia/useUpdateApiKey'
import { useIaProviders } from '@/hooks/ia/useIaProviders'
import useGetMyPrompts from '@/hooks/prompts/useGetPromptsByEvaluator'
import { useUpdateUser } from '@/hooks/user/useUpdateUser'
import useUpdatePromptText from '@/hooks/prompts/useUpdatePrompt'
import useRefreshPrompts from '@/hooks/prompts/useRefreshPrompts'
import { useNotify } from '@/hooks/useNotify'
import type { FormField } from '@/types/formTypes'
import { useAuthContext } from '@/context/AuthContext'

export default function IAScreen() {
    /* ─── refs ───────────────────────────────────────────────────────── */
    const providerFormRef = useRef<DynamicFormHandles>(null)
    const apiKeyFormRef = useRef<DynamicFormHandles>(null)
    const modelFormRef = useRef<DynamicFormHandles>(null)
    const promptsFormRef = useRef<DynamicFormHandles>(null)
    const { user } = useAuthContext()

    /* ─── proveedores / modelos ─────────────────────────────────────── */
    const { data: providers = [], isLoading: loadingProviders } = useIaProviders()
    const [providerSelected, setProviderSelected] = useState<string>(user?.provider ?? '')

    useEffect(() => {
        if (user?.provider) {
            setProviderSelected(user.provider)
        }
    }, [user?.provider])

    const providerOptions = providers.map(p => ({ value: p.provider, label: p.provider }))
    const modelsOfProvider = useMemo(
        () => providers.find(p => p.provider === providerSelected)?.models ?? [],
        [providers, providerSelected],
    )

    /* ─── prompts del evaluador ──────────────────────────────────────── */
    const { prompts, fetchPrompts } = useGetMyPrompts()
    const { updatePromptText } = useUpdatePromptText()
    const { refreshPrompts } = useRefreshPrompts()
    const { notifyInfo } = useNotify()

    const [fieldsPrompts, setFieldsPrompts] = useState<FormField[][]>([])
    const [initialValuesPrompts, setInitialValuesPrompts] = useState<Record<string, string>>({})
    const [idToNamePrompts, setIdToNamePrompts] = useState<Record<string, string>>({})

    useEffect(() => {
        fetchPrompts();
    }, [fetchPrompts]);

    useEffect(() => {
        const sorted = [...prompts].sort(
            (a, b) => parseFloat(a.codigo.replace(/^Q/, '')) - parseFloat(b.codigo.replace(/^Q/, '')),
        )

        const init: Record<string, string> = {}
        const nameMap: Record<string, string> = {}
        const rows: FormField[][] = []

        sorted.forEach((p, i) => {
            init[p.id] = p.texto
            nameMap[p.id] = p.nombre ?? ''
            if (i % 2 === 0) rows.push([])
            rows[rows.length - 1].push({
                type: 'textarea',
                key: p.id,
                placeholder: p.nombre ?? `Prompt ${i + 1}`,
                required: false,
                autoAdjust: true,
            })
        })

        setInitialValuesPrompts(init)
        setFieldsPrompts(rows)
        setIdToNamePrompts(nameMap)
    }, [prompts])

    /* ─── handlers ───────────────────────────────────────────────────── */
    const { updateApiKey } = useUpdateApiKey()
    const { updateUser } = useUpdateUser()

    const handleConfirmProvider = async (prov: string) => {
        await updateUser({ provider: prov, modelo: "" })

        setProviderSelected(prov)
    }

    const handleConfirmApiKey = async (apiKey: string) => {
        console.log('Nueva API Key:', apiKey, providerSelected)
        await updateApiKey(providerSelected, apiKey)
        apiKeyFormRef.current?.reset()
    }


    const handleConfirmModel = async (model: string) => {
        await updateUser({ modelo: model })
        console.log('Nuevo modelo:', model)
    }

    const handleConfirmUpdatePrompts = async (formData: Record<string, string>) => {
        const changes = Object.entries(formData).filter(([id, txt]) => txt !== initialValuesPrompts[id])
        if (!changes.length) {
            notifyInfo({ title: 'Sin cambios', description: 'No hay prompts modificados.', icon: 'ℹ️', closeButton: true })
            return
        }
        for (const [id, texto] of changes) {
            await updatePromptText(id, { texto }, idToNamePrompts[id] ?? id)
        }
        fetchPrompts()
    }

    const handleConfirmResetPrompts = async () => {
        await refreshPrompts()
        fetchPrompts()
    }

    /* ─── campos dinámicos ───────────────────────────────────────────── */
    const providerFields: FormField[] = [
        {
            type: 'select',
            key: 'provider',
            placeholder: loadingProviders ? 'Cargando…' : 'Proveedor',
            required: true,
            options: providerOptions,
        },
    ]

    /* ─── campos dinámicos ───────────────────────────────────────────── */
    const apiKeyFields: FormField[] = [
        { type: 'password', key: 'apiKey', placeholder: 'Nueva API Key', maxLength: 200 },
    ]

    const modelFields: FormField[] = [
        {
            type: 'select',
            key: 'model',
            placeholder: loadingProviders ? 'Cargando…' : 'Modelo',
            required: true,
            options: modelsOfProvider.map((m) => ({ value: m, label: m })),
        },
    ]

    /* ─── render ─────────────────────────────────────────────────────── */
    return (
        <IATemplate
            /* provider */
            initialProvider={providerSelected}
            providerTitle={`Proveedor actual: ${providerSelected}`}
            providerDesc='Selecciona el proveedor de IA que utilizará la plataforma.'
            providerFields={providerFields}
            providerFormRef={providerFormRef}
            onConfirmProvider={handleConfirmProvider}

            /* API-Key */
            titleSection1={`Proveedor y API Key de ${providerSelected}`}
            descSection1="Configura la clave para el proveedor de IA seleccionado."
            apiKeyFields={apiKeyFields}
            apiKeyFormRef={apiKeyFormRef}
            onConfirmApiKey={handleConfirmApiKey}

            /* Modelo */
            initialModel={user?.modelo ?? ''}
            titleSection2={`Modelo por defecto de ${providerSelected}`}
            descSection2="Selecciona el modelo que usará la plataforma."
            modelFields={modelFields}
            modelFormRef={modelFormRef}
            onConfirmModel={handleConfirmModel}

            /* Prompts */
            titleSection3="Prompts"
            descSection3="Modifica los prompts de la plataforma."
            promptsFields={fieldsPrompts}
            promptsFormRef={promptsFormRef}
            initialValuesPrompts={initialValuesPrompts}
            onConfirmUpdatePrompts={handleConfirmUpdatePrompts}
            onConfirmResetPrompts={handleConfirmResetPrompts}
        />
    )
}
